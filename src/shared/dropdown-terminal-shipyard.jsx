const React = require('react');
const _ = require('eplodash');
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const DropDownMenu = require('epui-md/DropDownMenu/DropDownMenu');
const MenuItem = require('epui-md/MenuItem/MenuItem');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const domain = require('~/src/store/domain');
const { connect } = require('react-redux');

const MIN_KEY_LENGTH = 2;

const DropDownTerminalShipYard = React.createClass({
  mixins: [Translatable],

  translations: require(`epui-intl/dist/SegmentDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.object,
    menuStyle: PropTypes.object,
    keyLabel: PropTypes.string,
    keyLabelStyle: PropTypes.object,
    required: PropTypes.bool,
    type: PropTypes.oneOf(['terminal', 'shipyard']),
    portId: PropTypes.string,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
      valid: true,
      dataSource: [],
    };
  },

  componentWillMount() {
    let { value, portId, type } = this.props;
    if(portId) {
      this._fetchTerminals(portId, true);

      if(!!value && type === 'shipyard'){
        this._fetchShipyards(portId);
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    let { portId, type } = nextProps;
    if(type !== this.props.type && this.props.type){
      this.setState({value: '', fullValue: {}, valid: true});
    }
    if(portId){
      if(type && type === 'terminal'){
        this._fetchTerminals(portId, true);
      }
      if(type && type === 'shipyard'){
        this._fetchShipyards(portId);
      }
      this.setState({valid:true});
    }
  },

  clearValue() {
    this.setState({
      value: null,
    });

    this.shipyardTerminal.clearValue();
  },

  // isValid() {
  //   let valid = true;
  //   if(this.props.required && !this.state.value) { valid = false };
  //   return new Promise((res, rej) => {
  //     this.setState({valid}, () => {res(valid);})
  //   });
  // },

  getValue() {
    let val = this.state.value;
    if(!val) { return null; }

    return val;
  },

  getFullValue() {
    let val = this.state.fullValue;
    if(!val) { return null; }

    return val;
  },

  getStyles() {
    let styles = {
      root: {
        display: 'inline-block',
      },
      floatingLabelStyle: {
        left: 0,
      },
      labelStyle: {
        paddingLeft: '0px',
      },
      underlineStyle: {
        margin: 0,
      },
    };
    styles.root = _.assign({}, this.props.style, styles.root);
    return styles;
  },

  isChanged() {
    return this.shipyardTerminal.isChanged();
  },

  render() {
    let {
      disabled,
      errorText,
      label,
      keyLabel,
      keyLabelStyle,
      type,
      ...others,
    } = this.props;
    let styles = this.getStyles();
    let {dataSource, terminals, shipyards, shipyard, terminal, value, fullValue, valid} = this.state;
    let val =  _.isObject(value) && value._id ? value._id : value;
    let found = false;
    let types = type === 'terminal' ? terminal : shipyard;
    let allTypes = type === 'terminal' ? terminals : shipyards;
    if (types) {
      dataSource = [];
      types.forEach((e, i) => {
        dataSource.push({
          text: e.name,
          value: e._id,
        });
      });
    }else if(value && !!value._id){
      dataSource.push({
        text: value.name,
        value: value._id,
      });
    }

    if(allTypes && allTypes.length > 0){
      dataSource = [];
      for(let t of allTypes) {
        if(t._id === value && value._id) { continue; }
        dataSource.push({
          text: t.name,
          value: t._id,
        });
      }
    }

    let menuProps = {
      maxHeight: 600,
    };

    return (
      <div style={styles.root}>
        <AutoComplete
          {...others}
          ref={(ref) => this.shipyardTerminal = ref}
          dataSource={dataSource}
          disabled={disabled}
          errorText={!valid && this.t('nErrorTextPortToIsRequired')}
          filter={this._filter}
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelText={type === 'terminal' ? this.t('nLabelSelectTerminal') : this.t('nLabelSelectShipyard')}
          hintText={type === 'terminal' ? this.t('nTextInputToFindTerminal') : this.t('nTextInputToFindShipyard')}
          labelStyle={styles.labelStyle}
          menuProps={menuProps}
          nullItemText={type === 'terminal' ? allTypes && allTypes.length > 0 ? this.t('nTextInputToFindTerminal') : this.t('nTextNoTerminalFound') : allTypes && allTypes.length > 0 ? this.t('nTextInputToFindShipyard') : this.t('nTextNoShipyardFound')}
          onClose={this._handleClose}
          onNewRequest={this._handleDropdownChange}
          onUpdateInput={this._handleQueryChange}
          showNullItem={true}
          underlineStyle={styles.underlineStyle}
          value={val}
          keyLabel={keyLabel}
          keyLabelStyle={keyLabelStyle}
          fullWidth={true}
        />
      </div>
    );
  },

  _filter(searchText, key) {
    return true;
  },

  _handleDropdownChange(selectedItem, index, value) {
    if(this.props.onChange) this.props.onChange(selectedItem);

    this.setState({
      value: value,
      fullValue: selectedItem,
    });
  },

  _createShipyard(){
    global.api.epds.createShipyard.promise({name:`test${Math.random()*100}`, port:'57ba956318c0b10af8988609'}).then(res=>{console.log(res.response);})
  },

  _fetchTerminals(portId, multiple) {
    if(this.state.terminalFetched) return;
    let { findTerminal } = global.api.epds;
    if (!_.isFunction(findTerminal)) {
      throw new Error(`api "findTerminal" is wrong: ${findTerminal}`)
    }

    findTerminal
    .promise(portId, '', multiple)
    .then(res => {
      this.setState({
        terminals: res.response,
      });
    })
    .catch(err => {
      console.error(err)
    });
  },

  _fetchShipyards(id) {
    if(this.state.shipyardFetched) return;
    let { findShipyards } = global.api.epds;
    if (!_.isFunction(findShipyards)) {
      throw new Error(`api "findShipyards" is wrong: ${findShipyards}`)
    }

    findShipyards
    .promise({
      cursor: 0,
      size: -1,
      total: 0,
      query:{
        port: id,
      }})
    .then(res => {
      this.setState({
        shipyards: res.response.entries,
      });
    })
    .catch(err => {
      console.error(err)
    });
  },

  _handleQueryChange(qry) {
    if(qry.length < MIN_KEY_LENGTH) {
      return;
    }

    let { searchShipyards, searchTerminals } = global.api.epds;
    let { portId, type } = this.props;
    if(!portId) { this.setState({valid: false});}
    if (portId && type && type === 'shipyard' && _.isFunction(searchShipyards)) {
      searchShipyards
      .promise({query: qry, size: 10 })
      .then(res => {
        let searched = res.response.entries;
        this.setState({
          shipyard: searched
        });
      })
      .catch(err => {
        console.error(err)
      });
    }

    if (portId && type && type === 'terminal' && _.isFunction(searchTerminals)) {
      searchTerminals
      .promise({query: qry, size: 10 })
      .then(res => {
        let searched = res.response.entries;
        this.setState({
          terminal: searched
        });
      })
      .catch(err => {
        console.error(err)
      });
    }
  },
});

module.exports = DropDownTerminalShipYard;
