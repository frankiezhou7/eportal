const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const FormGenerator = require('./mixins/form-generator');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translatable = require('epui-intl').mixin;
const FlatButton = require('epui-md/FlatButton');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const { List } = require('epimmutable');
const KEY_REGEX = /(^n[A-Z].*$)|(^[A-Z].*$)/;

const ShipParticularsUnit = React.createClass({

  mixins: [AutoStyle, FormGenerator, PureRenderMixin, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  translations: require(`epui-intl/dist/ShipParticulars/${__LOCALE__}`),

  propTypes: {
    ship: PropTypes.object,
    nTextBaseInfo: PropTypes.string,
    nTextTpc: PropTypes.string,
    nTextMark: PropTypes.string,
    nTextDraft: PropTypes.string,
    nTextSpeedMax: PropTypes.string,
    nTextSpeedAvarage: PropTypes.string,
    nTextGrtIctm69: PropTypes.string,
    nTextNrtIctm69: PropTypes.string,
    nTextGrtSuez: PropTypes.string,
    nTextNrtSuez: PropTypes.string,
    nTextFeeBoard: PropTypes.string,
    nTextDisplacement: PropTypes.string,
    nTextDWT: PropTypes.string,
    nTextLightShip: PropTypes.string,
    nTextLightFullLoad: PropTypes.string,
    nTextLightFWA: PropTypes.string,
    nTextHoldsNo: PropTypes.string,
    nTextHoldsMaxCargoWeight: PropTypes.string,
    nTextHoldsCubicCapacity: PropTypes.string,
    nTextHoldsMaxPermitLoad: PropTypes.string,
    nTextHoldsHatchLength: PropTypes.string,
    nTextHoldsHatchBreadth: PropTypes.string,
    nTextHoldsBallastTanksCapacity: PropTypes.string,
    nTextLengthOverall: PropTypes.string,
    nTextLengthRegistered: PropTypes.string,
    nTextLengthBetweenPerpendiculars: PropTypes.string,
    nTextLengthAtWaterLine: PropTypes.string,
    nTextLengthBowToBridge: PropTypes.string,
    nTextLengthBridgeToAft: PropTypes.string,
    nTextBreadthMoulded: PropTypes.string,
    nTextBreadthExtreme: PropTypes.string,
    nTextHeightToTopMast: PropTypes.string,
    nTextHeightToTopOfHatch: PropTypes.string,
    nTextDepthMoulded: PropTypes.string,
    nTextDepthExtreme: PropTypes.string,
    nTextTon: PropTypes.string,
    nTextKnot: PropTypes.string,
    nTextMeter: PropTypes.string,
    nTextCubeMeter: PropTypes.string,
    nTextTonPerCM: PropTypes.string,
    nTextTonPerSquareMeter: PropTypes.string,
    nTextHeight: PropTypes.string,
    nTextLength: PropTypes.string,
    nTextBreadth: PropTypes.string,
    nTextDepth: PropTypes.string,
    nTextLoadLines: PropTypes.string,
    nTextHolds: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextShipNationalityIsRequired: PropTypes.string,
    nTextShipType: PropTypes.string,
    renderToken: PropTypes.string,
  },

  getDefaultProps() {
    return {
    };
  },

  getInitialState() {
    return {
      modes: null,
    };
  },

  componentWillMount() {
    let ship = this.props.ship;

    if(!ship || !ship._id) {
      return;
    }

    ship.domain.actions.findShipByIdInMode(ship._id, 'edit');
  },

  componentWillReceiveProps(nextProps) {
    let ship = nextProps.ship;

    if (ship.isLoading() || (ship.viewModes && ship.viewModes.getMeta('loading'))) { return; }

    let error = ship.getMeta('error');

    if ((!!error && this.__saveButtonClicked) || ship._id !== this.props.ship._id) {
      ship.domain.actions.findShipByIdInMode(ship._id, 'edit');
      this.__saveButtonClicked = false;
    } else if (!error &&
      ship.viewModes &&
      (
        !this.state.modes ||
        (this.state.modes && ship._id !== this.props.ship._id)
      )
    ) {
      let modes = this._sortModes(ship.viewModes);

      this.setState({
        modes: modes,
      });
    }
  },

  // TODO: error handler of each component

  getStyles() {
    let styles = {
      root: {
        margin: '0 auto',
        padding: '10px 10px',
        width: global.contentWidth,
        minHeight: '100%',
        overflow: 'hidden',
      },
      row: {},
      saveButtonWrapper: {
        display: 'inline-block',
        width: '100%',
      },
      saveButton: {
        float: 'right',
      },
      title: {
        marginBottom: '10px',
        fontStyle: 'normal',
        fontSize: '14px',
        color:'#AEAEAE',
      },
      section: {
        width: '100%',
        margin: '16px 0',
      },
      textField: {
        display: 'inline-block',
        margin: '0 20px',
      },
      selectField: {
        display: 'inline-block',
        marginLeft: '10px',
      }
    };
    return styles;
  },

  renderElements() {
    let modes = this.state.modes;

    return this._generateForm(modes);
  },

  render() {
    let styles = this.getStyles();

    return (
      <Paper style={this.style('root')}>
        {this.renderElements()}
        <div style={this.style('saveButtonWrapper')}>
          <FlatButton
            ref='save'
            label={this.t('nTextSave')}
            primary={true}
            style={this.style('saveButton')}
            onTouchTap={this._handleTouchTapSave}
          />
        </div>
      </Paper>
    );
  },

  _handleFocus(e) {
  },

  _handleBlur(e) {
  },

  _handleChange(e) {
  },

  /**
   * 保存按钮对应的处理事件
   * @return {[type]} [description]
   */
  _handleTouchTapSave() {
    let values = [];
    let self = this;
    let ship = this.props.ship ? this.props.ship : this.props.ship;
    let modifiedShip = {
      '_id': ship._id,
    };
    let shipId = ship._id;
    let viewModes = ship.viewModes;

    let modes = this.state.modes;

    let actions = ship.domain.actions;

    this._getFormValue(modes, modifiedShip);

    // this.props.ship.domain.actions.updateShip('DujBLaIqoJd8MG96', shipId, modifiedShip);

    this.__saveButtonClicked = true;
  },

  /**
   * 根据属性值进行分组
   * @param  {[type]} lists [description]
   * @param  {[type]} prop  [description]
   * @return {[type]}       [description]
   */
  _createMapByProp(lists, prop) {
    let newMap = {};

    lists = lists.sortBy(list => list.get('sectionIndex'));

    for (let list of lists) {
      if(newMap[list.get(prop)] === undefined) {
        let tmpList = new List();
        tmpList = tmpList.push(list);
        newMap[list.get(prop)] = tmpList;
      } else {
        newMap[list.get(prop)] = newMap[list.get(prop)].push(list);
      }
    }

    return newMap;
  },

  /**
   * 组合出render需要的component数组数据
   * @param  {[type]} lists [description]
   * @param  {[type]} name  [description]
   * @param  {[type]} id    [description]
   * @return {[type]}       [description]
   */
  _flatJsonArrayRecursive(lists, name, id) {
    let newList = List();

    if (List.isList(lists)) {
      lists.forEach((list) => {
        let values = list.get('values');

        if (values && List.isList(values)) {
          values.forEach((value, index) => {
            let extendedName = name ? `${name}[${index}].` : `${list.get('name')}[${index}].`;
            let extendedIndex = index * (value.size ? value.size : 1);

            let children = this._flatJsonArrayRecursive(value, extendedName, extendedIndex);

            if (children && !children.isEmpty()) {
              children.forEach(child => {
                newList = newList.push(child);
              });
            }
          });
        } else {
          if (name) {
            list = list.set('name', name + list.get('name'));
          }
          if (id) {
            list = list.set('index', id + list.get('index'));
          }

          if (list.get('component')) newList = newList.push(list);
        }
      });
    }

    return newList;
  },

  /**
   * 获取修改后的ship对象
   * @param  {[type]} items  [description]
   * @param  {[type]} object [description]
   * @return {[type]}        [description]
   */
  _getShipObjectRecursive(lists, object, name) {
    let self = this;

    if (List.isList(lists)) {
      lists.forEach((list) => {
        let values = list.get('values');

        if (values && List.isList(values)) {
          values.forEach((value, index) => {
            let extendedName = name ? `${name}[${index}].` : `${list.get('name')}[${index}].`;

            this._getShipObjectRecursive(value, object, extendedName);
          });
        } else {
          let tempName = name ? name + list.get('name') : list.get('name');

          let ref = self.refs[tempName];

          if (ref) {
            let val = ref.getValue();

            if (_.isObject(val) && !_.isArray(val)) {
              val = val._id;
            }

            if (list.get('component')) {
              _.set(object, tempName, val);
            }
          }
        }
      });
    }
  },

});

module.exports = ShipParticularsUnit;
