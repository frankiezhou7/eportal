const React = require('react');
const _ = require('eplodash');
const AnchorageView = require('~/src/shared/anchorage-view');
const AutoStyle = require('epui-auto-style').mixin;
const BerthForm = require('~/src/shared/berth-form');
const Berths = require('~/src/shared/berths');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const Dialog = require('epui-md/ep/Dialog');
const DoneIcon = require('epui-md/svg-icons/action/done');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const FlatButton = require('epui-md/FlatButton');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const MenuItem = require('epui-md/MenuItem');
const Loading = require('epui-md/ep/RefreshIndicator');
const PortView = require('~/src/shared/port-view');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Tab = require('epui-md/Tabs/Tab');
const Tabs = require('epui-md/Tabs/Tabs');
const TerminalView = require('~/src/shared/terminal-view');
const TextFieldAnchorageName = require('~/src/shared/text-field-anchorage-name');
const TextFieldTerminalName = require('~/src/shared/text-field-terminal-name');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;

const {
  createAnchorage,
  createBerth,
  createPort,
  createTerminal,
  findAnchorage,
  findBerth,
  findPortById,
  findTerminal,
  removeAnchorage,
  removeBerth,
  removePortById,
  removeTerminal,
  updateAnchorage,
  updateBerth,
  updatePortById,
  updateTerminal,
} = global.api.epds;

const ID_PREFIX = 'temp_id_';

const TABS = {
  PORT: 'PORT',
  TERMINAL: 'TERMINAL',
  ANCHORAGE: 'ANCHORAGE',
};

require('epui-intl/lib/locales/' + __LOCALE__);

const PortForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/PortView/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
    close: PropTypes.func,
    portId: PropTypes.string,
    positionDialog: PropTypes.func,
    renderActions: PropTypes.func,
    style: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      isFetchingAnchorage: false,
      isFetchingPort: !!this.props.portId,
      isFetchingTerminal: false,
      port: {},
      portId: this.props.portId,
      value: TABS.PORT,
    };
  },

  componentWillMount() {
    let portId = this.getPortId();

    if (portId && _.isFunction(findPortById)) {
      findPortById
        .promise(portId)
        .then(({ response, status }) => {
          if (status === "OK") {
            let port = response;
            let terminalId, anchorageId;

            if (_.isObject(port)) {
              port = this.getTransformedPort(port);

              let {
                terminals,
                anchorages,
              } = port;

              if (_.isArray(terminals) && terminals.length) {
                terminalId = terminals[0]._id;
              }

              if (_.isArray(anchorages) && anchorages.length) {
                anchorageId = anchorages[0]._id;
              }
            }

            this.setState({
              isFetchingPort: false,
              port,
              terminalId,
              anchorageId,
            }, () => {
              let { positionDialog } = this.props;
              if (_.isFunction(positionDialog)) {
                positionDialog();
              }
            });
          } else {
            alert(this.t('nTextFetchDataFail'));
          }
        })
        .catch(err => {
          alert(this.t('nTextFetchDataFail'));
        });
    }
  },

  componentDidMount() {
    this.renderActions();
  },

  componentWillUnmount() {
    clearTimeout(this.timeout);
  },

  savePort() {
    this.port
      .isValid()
      .then((valid) => {
        if (valid) {
          let value = this.port.getValue();
          let {
            port: {
              _id,
              __v,
            },
          } = this.state;

          if (_.isObject(value)) {
            value._id = _id;
            value.__v = __v;
          }

          this.savePortInfo(value);
        }
      });
  },

  savePortInfo(port) {
    let portId = this.getPortId();
    let requestPort = this.getTransformedPort(port, '_id');

    if (portId) {
      if (_.isFunction(updatePortById)) {
        delete requestPort.code; // 修改港口信息时，不修改港口代码

        updatePortById
          .promise(portId, requestPort)
          .then(({ response, status }) => {
            if (status === 'OK') {
              let {
                domesticAirport,
                internationalAirport,
              } = port;

              alert(this.t('nTextSavePortInfoSuccess'));

              this.setState({
                port: Object.assign({}, this.state.port, response, {
                  domesticAirport,
                  internationalAirport,
                }),
              });
            } else {
              alert(this.t('nTextSavePortInfoFail'));
            }
          })
          .catch(err => {
            const msg = err && err.message;
            let text = this.t('nTextSavePortInfoFail');

            if (msg) {
              const arr = _.split(msg, ' ');
              const index = _.indexOf(arr, 'duplicate');
              if (-1 !== index) {
                text = this.t('nTextSavePortInfoFailWithDuplicateCode');
              }
            }
            alert(text);
          });
      }
    } else {
      if (_.isFunction(createPort)) {
        createPort
          .promise(requestPort)
          .then(({ response, status }) => {
            if (status === 'OK') {
              let {
                domesticAirport,
                internationalAirport,
              } = port;
              let portId = response && response._id;

              alert(this.t('nTextSavePortInfoSuccess'));

              this.setState({
                port: Object.assign({}, response, {
                  domesticAirport,
                  internationalAirport,
                }),
                portId,
              });
            } else {
              alert(this.t('nTextSavePortInfoFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextSavePortInfoFail'));
          });
      }
    }
  },

  saveTerminal() {
    this.terminal
      .isValid()
      .then((valid) => {
        if (valid) {
          let value = this.terminal.getValue();
          let berthVal = this.berths.getValue();
          value.berths = berthVal;

          this.saveTerminalInfo(value);
        }
      });
  },

  saveTerminalInfo(terminal) {
    let {
      port: {
        terminals,
      },
      terminalId,
    } = this.state;

    let { port } = this.state;

    if (terminalId && !_.startsWith(terminalId, ID_PREFIX)) {
      if (_.isFunction(updateTerminal)) {
        let t = _.find(terminals, ['_id', terminalId]);
        terminal.id = t._id;
        terminal.__v = t.__v;

        updateTerminal
          .promise(port._id, port.__v, terminal)
          .then(({ response, status }) => {
            if (status === 'OK') {
              let {
                __v,
                terminal,
              } = response;

              let index = _.findIndex(port.terminals, ["_id", terminal._id]);
              port.terminals[index] = Object.assign({}, terminal, {fetched: true});
              port.terminals[index].berths = t.berths;
              port.__v = __v;

              alert(this.t('nTextSaveTerminalInfoSuccess'));

              this.setState({
                port,
              });
            } else {
              alert(this.t('nTextSaveTerminalInfoFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextSaveTerminalInfoFail'));
          });
      }
    } else {
      if (_.isFunction(createTerminal)) {
        let {
          port: {
            _id,
            __v,
            terminals,
          },
        } = this.state;

        createTerminal
          .promise(_id, __v, terminal)
          .then(res => {
            let {
              response: {
                __v,
              },
              status,
            } = res;

            if (status === 'OK') {
              let port = this.state.port;
              let id = res.response.terminal._id;

              if (_.isArray(terminals)) {
                let index = _.findIndex(terminals, ['_id', terminalId]);

                port.terminals[index] = res.response.terminal;
              } else {
                port.terminals = [res.response.terminal];
              }
              port.__v = __v;

              alert(this.t('nTextSaveTerminalInfoSuccess'));

              this.setState({
                port,
                terminalId: id,
              });
            } else {
              alert(this.t('nTextSaveTerminalInfoFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextSaveTerminalInfoFail'));
          });
      }
    }
  },

  saveAnchorage() {
    this.anchorage
      .isValid()
      .then(valid => {
        if (valid) {
          let value = this.anchorage.getValue();
          this.saveAnchorageInfo(value);
        }
      });
  },

  saveAnchorageInfo(anchorage) {
    let {
      port: {
        _id,
        __v,
        anchorages,
      },
      anchorageId,
    } = this.state;

    let { port } = this.state;

    if (anchorageId && !_.startsWith(anchorageId, ID_PREFIX)) {
      if (_.isFunction(updateAnchorage)) {
        let t = _.find(anchorages, ['_id', anchorageId]);
        anchorage.id = t._id;
        anchorage.__v = t.__v;

        updateAnchorage
          .promise(_id, __v, anchorage)
          .then(({ response, status }) => {
            if (status === 'OK') {
              let {
                __v,
                anchorage,
              } = response;

              let index = _.findIndex(port.anchorages, ["_id", anchorage._id]);
              port.anchorages[index] = Object.assign({}, anchorage, {fetched: true});
              port.__v = __v;

              alert(this.t('nTextSaveAnchorageInfoSuccess'));

              this.setState({
                port,
              });
            } else {
              alert(this.t('nTextSaveAnchorageInfoFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextSaveAnchorageInfoFail'));
          });
      }
    } else {
      if (_.isFunction(createAnchorage)) {
        createAnchorage
          .promise(_id, __v, anchorage)
          .then(res => {
            let {
              response: {
                __v,
              },
              status,
            } = res;

            if (status === 'OK') {
              let port = this.state.port;
              let id = res.response.anchorage._id;

              if (_.isArray(anchorages)) {
                let index = _.findIndex(anchorages, ['_id', anchorageId]);

                port.anchorages[index] = res.response.anchorage;
              } else {
                port.anchorages = [res.response.anchorage];
              }
              port.__v = __v;

              alert(this.t('nTextSaveAnchorageInfoSuccess'));

              this.setState({
                port,
                anchorageId: id,
              });
            } else {
              alert(this.t('nTextSaveAnchorageInfoFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextSaveAnchorageInfoFail'));
          });
      }
    }
  },

  getPortId() {
    return this.state.portId;
  },

  getTransformedPort(port, dataField) {
    if (!port) { return port; }

    let obj = {};

    if (_.isObject(port)) {
      obj = Object.assign({}, port);

      obj.domesticAirport = _.isArray(obj.domesticAirport) ?
                              obj.domesticAirport[0] :
                              obj.domesticAirport;
      obj.internationalAirport = _.isArray(obj.internationalAirport) ?
                                    obj.internationalAirport[0] :
                                    obj.internationalAirport;

      if (dataField) {
        obj.domesticAirport = _.isObject(obj.domesticAirport) ?
                                obj.domesticAirport[dataField] :
                                obj.domesticAirport;
        obj.internationalAirport = _.isObject(obj.internationalAirport) ?
                                      obj.internationalAirport[dataField] :
                                      obj.internationalAirport;
      }

      // delete obj.region;
    }

    return obj;
  },

  handleTouchTap() {
    let { value } = this.state;

    switch (value) {
      case TABS.PORT:
        this.savePort();
        break;
      case TABS.TERMINAL:
        this.saveTerminal();
        break;
      case TABS.ANCHORAGE:
        this.saveAnchorage();
        break;
      default:
    }
  },

  handleTouchTapRemovePort() {
    if (_.isFunction(global.epConfirm)) {
      global.epConfirm('All related information will be deleted, please do it carefully.', 'Delete Port', this.handleRemovePort);
    }
  },

  handleRemovePort() {
    let portId = this.getPortId();
    let { close } = this.props;
    let {
      port: { __v },
    } = this.state;

    if (portId && _.isFunction(removePortById)) {
      removePortById
        .promise(portId, __v)
        .then(({ response, status }) => {
          if (status === 'OK') {
            if (_.isFunction(close)) {
              close();
            }
          } else {
            alert(this.t('nTextRemoveDataFail'));
          }
        })
        .catch(err => {
          alert(this.t('nTextRemoveDataFail'));
        });
    }
  },

  handleTouchTapRemoveTerminal() {
    if (_.isFunction(global.epConfirm)) {
      global.epConfirm('All related information will be deleted, please do it carefully.', 'Delete Terminal', this.handleRemoveTerminal);
    }
  },

  handleRemoveTerminal() {
    let {
      terminalId,
      port: {
        _id,
        __v,
        terminals,
      },
    } = this.state;
    let terminal;

    if (!_.isArray(terminals) || !_id || !terminalId || !_.isFunction(removeTerminal)) { return; }

    terminal = _.find(terminals, ['_id', terminalId]);

    if (!terminal || !_.isObject(terminal)) { return; }

    if (_.startsWith(terminalId, ID_PREFIX)) {
      let {
        port,
        value,
      } = this.state;
      _.remove(terminals, ['_id', terminalId]);
      value = terminals.length ? value : TABS.PORT;
      port.terminals = terminals;

      this.setState({
        port,
        terminalId: terminals[0] && terminals[0]._id,
        value,
      });
    } else {
      removeTerminal
        .promise(_id, __v, {
          id: terminal._id,
          __v: terminal.__v,
        })
        .then(({ response, status }) => {
          if (status === 'OK') {
            if (!response) { return; }
            let {
              _id,
              __v,
              terminal,
            } = response;
            let terminalId = terminal && terminal.id;
            let {
              port,
              value,
            } = this.state;

            let terminals = port.terminals;
            if (!_.isArray(terminals)) { return; }
            _.remove(terminals, ['_id', terminalId]);
            port.__v = __v;
            value = terminals.length ? value : TABS.PORT;

            this.setState({
              port,
              terminalId: terminals[0] && terminals[0]._id,
              value,
            });
          } else {
            alert(this.t('nTextRemoveDataFail'));
          }
        })
        .catch(err => {
          alert(this.t('nTextRemoveDataFail'));
        });
    }
  },

  handleTouchTapRemoveAnchorage() {
    if (_.isFunction(global.epConfirm)) {
      global.epConfirm('All related information will be deleted, please do it carefully.', 'Delete Anchorage', this.handleRemoveAnchorage);
    }
  },

  handleRemoveAnchorage() {
    let {
      anchorageId,
      port: {
        _id,
        __v,
        anchorages,
      },
    } = this.state;
    let anchorage;

    if (!_.isArray(anchorages) || !_id || !anchorageId || !_.isFunction(removeAnchorage)) { return; }

    anchorage = _.find(anchorages, ['_id', anchorageId]);

    if (!anchorage || !_.isObject(anchorage)) { return; }

    if (_.startsWith(anchorageId, ID_PREFIX)) {
      let {
        port,
        value,
      } = this.state;

      let anchorages = port.anchorages;
      if (!_.isArray(anchorages)) { return; }
      _.remove(anchorages, ['_id', anchorageId]);
      value = anchorages.length ? value : TABS.PORT;
      port.anchorages = anchorages;

      this.setState({
        port,
        anchorageId: anchorages[0] && anchorages[0]._id,
        value,
      });
    } else {
      removeAnchorage
        .promise(_id, __v, { id: anchorage._id, __v: anchorage.__v})
        .then(({ response, status }) => {
          if (status === 'OK') {
            if (!response) { return; }
            let {
              _id,
              __v,
              anchorage,
            } = response;
            let anchorageId = anchorage && anchorage.id;
            let {
              port,
              value,
            } = this.state;

            let anchorages = port.anchorages;
            if (!_.isArray(anchorages)) { return; }
            _.remove(anchorages, ['_id', anchorageId]);
            port.__v = __v;
            value = anchorages.length ? value : TABS.PORT;

            this.setState({
              port,
              anchorageId: anchorages[0] && anchorages[0]._id,
              value,
            });
          } else {
            alert(this.t('nTextRemoveDataFail'));
          }
        })
        .catch(err => {
          alert(this.t('nTextRemoveDataFail'));
        });
    }
  },

  fetchTerminal() {
    if (this.shouldFetchTerminal() && _.isFunction(findTerminal)) {
      let {
        port: {
          _id,
          __v,
          terminals,
        },
        terminalId,
      } = this.state;

      let { port } = this.state;

      this.setState({
        isFetchingTerminal: true,
      }, () => {
        findTerminal
          .promise(_id, terminalId)
          .then(({ response, status }) => {
            if (status === 'OK') {
              if (_.isArray(terminals)) {
                let index = _.findIndex(terminals, ['_id', terminalId]);
                port.terminals[index] = Object.assign({}, response, {fetched: true});
              }

              this.setState({
                isFetchingTerminal: false,
                port,
              });
            } else {
              alert(this.t('nTextFetchDataFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextFetchDataFail'));
          });
      });
    }
  },

  fetchAnchorage() {
    if (this.shouldFetchAnchorage() && _.isFunction(findAnchorage)) {
      let {
        port: {
          _id,
          __v,
          anchorages,
        },
        anchorageId,
      } = this.state;

      let { port } = this.state;

      this.setState({
        isFetchingAnchorage: true,
      }, () => {
        findAnchorage
          .promise(_id, anchorageId)
          .then(({ response, status }) => {
            if (status === 'OK') {
              if (_.isArray(anchorages)) {
                let index = _.findIndex(anchorages, ['_id', anchorageId]);
                port.anchorages[index] = Object.assign({}, response, {fetched: true});
              }

              this.setState({
                isFetchingAnchorage: false,
                port,
              });
            } else {
              alert(this.t('nTextFetchDataFail'));
            }
          })
          .catch(err => {
            alert(this.t('nTextFetchDataFail'));
          });
      });
    }
  },

  shouldFetchTerminal() {
    let {
      terminalId,
      port: {
        terminals,
      },
      value,
    } = this.state;

    if (!terminalId || _.startsWith(terminalId, ID_PREFIX) || value !== TABS.TERMINAL) { return false; }

    let should = true;

    if (_.isArray(terminals)) {
      let terminal = _.find(terminals, ['_id', terminalId]);
      if (terminal.fetched) {
        should = false;
      }
    }

    return should;
  },

  shouldFetchAnchorage() {
    let {
      anchorageId,
      port: {
        anchorages,
      },
      value,
    } = this.state;

    if (!anchorageId || _.startsWith(anchorageId, ID_PREFIX) || value !== TABS.ANCHORAGE) { return false; }

    let should = true;

    if (_.isArray(anchorages)) {
      let anchorage = _.find(anchorages, ['_id', anchorageId]);
      if (anchorage.fetched) {
        should = false;
      }
    }

    return should;
  },

  getId() {
    if (!this.__id) {
      this.__id = 1;
    }

    return `${ID_PREFIX}${this.__id++}`;
  },

  handleRemoveBerthInfo(berthId) {
    if (!berthId || !_.isFunction(removeBerth)) { return; }

    let {
      port,
      terminalId,
    } = this.state;

    let index = _.findIndex(port.terminals, ['_id', terminalId]);
    let terminal = port.terminals[index];
    let idx = _.findIndex(terminal.berths, ['_id', berthId]);
    let berth = terminal.berths[idx];

    removeBerth
      .promise(port._id, port.__v, {
        id: terminal._id,
        __v: terminal.__v,
        remove: {
          id: berth._id,
          __v: berth.__v,
        },
      })
      .then(({ response, status }) => {
        if (status === 'OK') {
          port.__v = response.__v;
          port.terminals[index].__v = response.terminal.__v;
          _.remove(port.terminals[index].berths, ['_id', berthId]);

          this.setState({
            berthId: null,
            port,
            show: false,
          });
        } else {
          alert(this.t('nTextRemoveDataFail'));
        }
      })
      .catch(err => {
        alert(this.t('nTextRemoveDataFail'));
      });
  },

  handleSaveBerthInfo(berthId, info) {
    let {
      port: {
        _id,
        __v,
        terminals,
      },
      terminalId,
    } = this.state;

    let { port } = this.state;

    let index = _.findIndex(terminals, ['_id', terminalId]);
    let terminal = terminals[index];
    let terminalVersion = terminal && terminal.__v;

    if (!berthId) {
      createBerth
        .promise(_id, __v, {
          id: terminalId,
          __v: terminalVersion,
          create: info,
        })
        .then(({ response, status }) => {
          if (status === 'OK') {
            let { port } = this.state;
            port.__v = response.__v;
            port.terminals[index].__v = response.terminal.__v;
            if (_.isArray(port.terminals[index].berths)) {
              port.terminals[index].berths.push(response.terminal.berth)
            } else {
              port.terminals[index].berths = [response.terminal.berth];
            }

            const berthId = response.terminal.berth._id;

            this.setState({
              berthId,
              port,
              showTips: true,
              tips: this.t('nTextSaveBerthInfoSuccess'),
            });
          } else {
            this.setState({
              showTips: true,
              tips: this.t('nTextSaveBerthInfoFail'),
            });
          }
        })
        .catch(err => {
          this.setState({
            showTips: true,
            tips: this.t('nTextSaveBerthInfoFail'),
          });
        });
    } else {
      let idx = _.findIndex(terminal.berths, ['_id', berthId]);
      let berth = terminal.berths[idx];

      updateBerth
        .promise(_id, __v, {
          id: terminalId,
          __v: terminalVersion,
          update: {
            id: berthId,
            __v: berth && berth.__v,
            ...info,
          },
        })
        .then(({ response, status }) => {
          if (status === 'OK') {
            port.__v = response.__v;
            port.terminals[index].__v = response.terminal.__v;
            port.terminals[index].berths[idx] = response.terminal.berth;

            this.setState({
              port,
              showTips: true,
              tips: this.t('nTextSaveBerthInfoSuccess'),
            });
          } else {
            alert(this.t('nTextSaveBerthInfoFail'));
          }
        })
        .catch(err => {
          alert(this.t('nTextSaveBerthInfoFail'));
        });
    }
  },

  handleShowBerthDialog(berthId) {
    let {
      port,
      terminalId,
    } = this.state;

    if (berthId) {
      findBerth
        .promise(port._id, terminalId, berthId)
        .then(({ response }) => {
          let index = _.findIndex(port.terminals, ['_id', terminalId]);
          let terminal = port.terminals[index];
          let idx = _.findIndex(terminal.berths, ['_id', berthId]);
          port.terminals[index].berths[idx] = response;

          this.setState({
            berthId,
            port,
            show: true,
          });
        });
    } else {
      this.setState({
        show: true,
      });
    }
  },

  handleChange(value) {
    if (!_.includes(TABS, value) || value === this.state.value) { return; }

    this.timeout = setTimeout(() => {
      this.setState({
        value,
      }, () => {
        this.renderActions();
        this.fetchTerminal();
        this.fetchAnchorage();
      });
    }, 300);
  },

  handleChangeTerminal(event, index, value) {
    let { terminalId } = this.state;
    if (terminalId !== value) {
      this.setState({
        terminalId: value,
      }, () => {
        this.fetchTerminal();
      });
    }
  },

  handleChangeAnchorage(event, index, value) {
    let { anchorageId } = this.state;
    if (anchorageId !== value) {
      this.setState({
        anchorageId: value,
      }, () => {
        this.fetchAnchorage();
      });
    }
  },

  handleTouchTapAddTerminal() {
    this.setState({
      open: TABS.TERMINAL,
    });
  },

  handleTouchTapAddAnchorage() {
    this.setState({
      open: TABS.ANCHORAGE,
    });
  },

  handleTouchTapCancel() {
    this.setState({
      open: false,
    });
  },

  handleTouchTapSave(berthId) {
    this.berth
      .isValid()
      .then(valid => {
        if (valid) {
          let value = this.berth.getValue();

          this.handleSaveBerthInfo(berthId, value);
        }
      });
  },

  handleTouchTapClose() {
    this.setState({
      show: false,
    });
  },

  handleTouchTapCloseTips() {
    this.setState({
      showTips: false,
      tips: '',
    });
  },

  handleTouchTapOk(token) {
    let { port } = this.state;

    if (token === TABS.TERMINAL) {
      this.terminalName
        .isValid()
        .then(valid => {
          if (valid) {
            let terminalId = this.getId();
            let name = this.terminalName.getValue();
            if (_.isArray(port.terminals)) {
              port.terminals.push({_id: terminalId, name});
            } else {
              port.terminals = [{_id: terminalId, name}];
            }

            this.setState({
              open: false,
              port,
              terminalId,
            });
          }
        });
    } else if (token === TABS.ANCHORAGE) {
      this.anchoageName
        .isValid()
        .then(valid => {
          if (valid) {
            let anchorageId = this.getId();
            let name = this.anchoageName.getValue();
            if (_.isArray(port.anchorages)) {
              port.anchorages.push({_id: anchorageId, name});
            } else {
              port.anchorages = [{_id: anchorageId, name}];
            }

            this.setState({
              open: false,
              port,
              anchorageId,
            });
          }
        });
    }
  },

  handleClose() {
    const { close } = this.props;

    if (_.isFunction(close)) {
      close();
    }
  },

  handleCloseTips() {
    this.setState({
      showTips: false,
      tips: '',
    });
  },

  getStyles() {
    const theme = this.context.muiTheme;

    let styles = {
      root: {
        position: 'relative',
        margin: '10px auto',
        width: global.contentWidth,
        boxSizing: 'border-box',
      },
      berthContentStyle: {
        width: '980px',
        maxWidth: '100%',
      },
      berths: {
        padding: '4px 10px',
        width: '100%',
        lineHeight: '24px',
        fontSize: '16px',
      },
      button: {
        margin: '5px',
      },
      buttonWrapper: {
        position: 'absolute',
        float: 'right',
        right: '20px',
        width: '320px',
      },
      control: {
        cursor: 'pointer',
      },
      floatingAction: {
        position: 'absolute',
        right: '40px',
        top: '150px',
      },
      footer: {
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        paddingBottom: '20px',
      },
      inkBar: theme.inkBar,
      label: {
        color: theme.epColor.primaryColor,
      },
      loadingWrapper: {
        position: 'relative',
        width: '100%',
        minHeight: '800px',
      },
      tabItemContainer: {
        width: '600px',
        backgroundColor: theme.epColor.whiteColor,
      },
      remove: {
        position: 'relative',
        display: 'block',
        margin: '10px auto',
        width: '200px',
      },
      tab: {
        fontSize: '14px',
        color: theme.epColor.primaryColor,
        cursor: 'pointer',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      },
      tips: {
        marginTop: '24px',
        textAlign: 'center',
        color: '#e44d3c',
        fontSize: '16px',
        letterSpacing: '0.57px',
      },
      underline: {
        display: 'none',
      },
    };

    return styles;
  },

  renderLoading(styles) {
    return (
      <div
        key="loading"
        style={styles.loadingWrapper}
      >
        <Loading style={styles.loading} />
      </div>
    );
  },

  getText() {
    const { value } = this.state;
    let text = '';

    switch (value) {
      case TABS.PORT:
        text = this.t('nTextSavePortInfo');
        break;
      case TABS.TERMINAL:
        text = this.t('nTextSaveTerminalInfo');
        break;
      case TABS.ANCHORAGE:
        text = this.t('nTextSaveAnchorageInfo');
        break;
      default:
    }

    return text;
  },

  renderActions(disabled) {
    const { renderActions } = this.props;

    const actions = [{
      text: this.getText(),
      disabled,
      onTouchTap: this.handleTouchTap,
    }, {
      text: this.t('nTextClose'),
      onTouchTap: this.handleClose,
    }];

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  render() {
    let { style } = this.props;

    let {
      anchorageId,
      berthId,
      isFetchingAnchorage,
      isFetchingPort,
      isFetchingTerminal,
      open,
      port,
      portId,
      show,
      showTips,
      terminalId,
      tips,
      value,
    } = this.state;

    let styles = this.getStyles();

    if (isFetchingPort) {
      return this.renderLoading(styles);
    }

    const {
      PORT,
      TERMINAL,
      ANCHORAGE,
    } = TABS;

    let terminal = {}, anchorage = {}, berth = {};
    const hasTerminals = port ? port.terminals ? port.terminals.length : false : false;
    const hasAnchorages = port ? port.anchorages ? port.anchorages.length : false : false;
    const tabMenuTerminal = hasTerminals ? (
      <DropDownMenu
        ref={(ref) => this.terminalMenu = ref}
        controlStyle={styles.control}
        disabled={value !== TABS.TERMINAL}
        labelStyle={styles.label}
        onChange={this.handleChangeTerminal}
        underlineStyle={this.style('underline')}
        value={terminalId || port.terminals[0]._id}
      >
        {
          _.map(port.terminals, (terminal) => {
            return (
              <MenuItem
                key={terminal._id}
                value={terminal._id}
                primaryText={terminal.name}
              />
            );
          })
        }
      </DropDownMenu>
    ) : null;

    const tabMenuAnchorage = hasAnchorages ? (
      <DropDownMenu
        ref={(ref) => this.anchorageMenu = ref}
        controlStyle={styles.control}
        disabled={value !== TABS.ANCHORAGE}
        labelStyle={styles.label}
        onChange={this.handleChangeAnchorage}
        underlineStyle={this.style('underline')}
        value={anchorageId || port.anchorages[0]._id}
      >
        {
          _.map(port.anchorages, (anchorage) => {
            return (
              <MenuItem
                key={anchorage._id}
                value={anchorage._id}
                primaryText={anchorage.name}
              />
            );
          })
        }
      </DropDownMenu>
    ) : null;

    if (_.isObject(port)) {
      let {
        anchorages,
      } = port;

      let { terminals } = this.state.port

      if (_.isArray(terminals) && terminalId) {
        for (let obj of terminals) {
          if (terminalId === obj._id) {
            terminal = obj;

            let berths = terminal && terminal.berths;

            if (_.isArray(berths)) {
              for (let obj of berths) {
                if (berthId === obj._id) {
                  berth = obj;
                }
              }
            }
          }
        }
      }

      if (_.isArray(anchorages) && anchorageId) {
        for (let obj of anchorages) {
          if (anchorageId === obj._id) {
            anchorage = obj;
          }
        }
      }
    }

    let terminals = port && port.terminals;
    if (_.isArray(terminals)) {
      anchorage.items = _.filter(terminals, t => {
        return !_.startsWith(t._id, ID_PREFIX);
      });
    }

    let terminalElement = isFetchingTerminal ? [
      this.renderLoading(styles)
    ] : [
      <TerminalView
        key="terminal-view"
        ref={(ref) => this.terminal = ref}
        terminalId={terminalId && !_.startsWith(terminalId, ID_PREFIX)}
        value={terminal}
      />,
    ];

    if (terminalId && !isFetchingTerminal) {
      terminalElement.push(
        <div key="title-berths" style={styles.berths}>Berths</div>,
        <Berths
          key="berths"
          ref={(ref) => this.berths = ref}
          items={terminal && terminal.berths}
          onShow={this.handleShowBerthDialog}
        />,
        <div key="delete-berth" style={styles.footer}>
          <RaisedButton
            ref={(ref) => this.remove = ref}
            backgroundColor="#e44d3c"
            label="Delete the terminal"
            labelColor="#ffffff"
            style={styles.remove}
            onTouchTap={this.handleTouchTapRemoveTerminal}
          />
        </div>,
      );
    }

    let anchorageElement = isFetchingAnchorage ? [
      this.renderLoading(styles)
    ] : [
      <AnchorageView
        key="anchorage-view"
        ref={(ref) => this.anchorage = ref}
        anchorageId={anchorageId && !_.startsWith(anchorageId, ID_PREFIX)}
        value={anchorage}
      />
    ];

    if (anchorageId && !isFetchingAnchorage) {
      anchorageElement.push(
        <div key="delete-anchorage" style={styles.footer}>
          <RaisedButton
            ref={(ref) => this.remove = ref}
            backgroundColor="#e44d3c"
            label="Delete the anchorage"
            labelColor="#ffffff"
            style={styles.remove}
            onTouchTap={this.handleTouchTapRemoveAnchorage}
          />
        </div>,
      );
    }

    const actions = [
      <FlatButton
        key="ok"
        label={this.t('nTextSave')}
        secondary
        onTouchTap={this.handleTouchTapOk.bind(this, open)}
      />,
      <FlatButton
        key="cancel"
        label={this.t('nTextClose')}
        secondary
        onTouchTap={this.handleTouchTapCancel}
      />,
    ];

    const actionsBerth = [
      <FlatButton
        ref="save"
        label={this.t('nTextSave')}
        secondary
        onTouchTap={this.handleTouchTapSave.bind(this, berthId)}
      />,
      <FlatButton
        key="close"
        label={this.t('nTextClose')}
        secondary
        onTouchTap={this.handleTouchTapClose}
      />,
    ];

    const actionsBerthConfirm = [
      <FlatButton
        key="confirm"
        label={this.t('nTextConfirm')}
        secondary
        onTouchTap={this.handleTouchTapCloseTips}
      />,
    ];

    return (
      <div style={Object.assign(styles.root, style)}>
        <div style={styles.buttonWrapper}>
          <RaisedButton
            ref={(ref) => this.addTerminal = ref}
            disabled={!portId}
            label="Add Terminal"
            primary
            style={styles.button}
            onTouchTap={this.handleTouchTapAddTerminal}
          />
          <RaisedButton
            ref={(ref) => this.addAnchorage = ref}
            disabled={!portId}
            label="Add Anchorage"
            primary
            style={styles.button}
            onTouchTap={this.handleTouchTapAddAnchorage}
          />
        </div>
        <Tabs
          inkBarStyle={styles.inkBar}
          onChange={this.handleChange}
          tabItemContainerStyle={styles.tabItemContainer}
          value={value}
        >
          <Tab
            key="general"
            label="GENERAL INFORMATION"
            style={styles.tab}
            value={PORT}
          >
            <PortView
              ref={(ref) => this.port = ref}
              value={port}
            />
            {
              // portId &&
              // <div style={styles.footer}>
              //   <RaisedButton
              //     ref={(ref) => this.remove = ref}
              //     backgroundColor="#e44d3c"
              //     label="Delete the port"
              //     labelColor="#ffffff"
              //     onTouchTap={this.handleTouchTapRemovePort}
              //     style={styles.remove}
              //   />
              //   <div style={styles.tips}>
              //     All information abount port/terminal/anchorage will be cleared if you delete the port, please do it carefully.
              //   </div>
              // </div>
            }
          </Tab>
          {
            hasTerminals &&
              <Tab
                key="terminal"
                label={tabMenuTerminal}
                style={styles.tab}
                value={TERMINAL}
              >
                {terminalElement}
              </Tab>
          }
          {
            hasAnchorages &&
              <Tab
                key="anchorage"
                label={tabMenuAnchorage}
                style={styles.tab}
                value={ANCHORAGE}
              >
                {anchorageElement}
              </Tab>
          }
        </Tabs>
        <Dialog
          actions={actions}
          open={!!open}
          modal
        >
          {
            open === TABS.TERMINAL &&
              <TextFieldTerminalName
                ref={(ref) => this.terminalName = ref}
                required
              />
          }
          {
            open === TABS.ANCHORAGE &&
              <TextFieldAnchorageName
                ref={(ref) => this.anchoageName = ref}
                required
              />
          }
        </Dialog>
        <Dialog
          actions={actionsBerth}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          bodyStyle={styles.berthContentStyle}
          contentStyle={styles.berthContentStyle}
          modal
          open={show}
        >
          <BerthForm
            ref={(ref) => this.berth = ref}
            onRemove={this.handleRemoveBerthInfo}
            onRequestCloseTips={this.handleCloseTips}
            onSave={this.handleSaveBerthInfo}
            showTips={showTips}
            tips={tips}
            value={berth}
          />
        </Dialog>
      </div>
    );
  },
});

module.exports = PortForm;
