const React = require('react');
const _ = require('eplodash');
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { searchStates } = global.api.epds;
// const { connect } = require('react-redux');

const MIN_KEY_LENGTH = 2;
const MAX_KEY_LENGTH = 16;

const DropDownStatesInner= React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DropDownStates/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    dataField: PropTypes.string,
    disabled: PropTypes.bool,
    displayField: PropTypes.string,
    floatingLabelText: PropTypes.string,
    floatingLabelStyle:PropTypes.object,
    hintText: PropTypes.string,
    label: PropTypes.string,
    nullItemText: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    underlineShow: PropTypes.bool,
    width: PropTypes.number,
    margin: PropTypes.number,
    menuStyle: PropTypes.object,
    keyLabel: PropTypes.string,
    keyLabelStyle: PropTypes.object,
    required: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      dataField: '_id',
      disabled: false,
      displayField: 'name',
    };
  },

  getInitialState() {
    return {
      entries: [],
      data: this.props.value && this.props.value,
    };
  },

  componentWillMount() {
    this._fetchStates();
  },

  componentWillReceiveProps(nextProps) {
    // let { defaultValue } = nextProps;
    // if (this.shallowEqual(nextProps)) {
    //   this.setState({
    //     value: defaultValue,
    //   });
    // }
  },

  // shouldComponentUpdate(nextProps, nextState) {
  //   let shouldUpdate = this.shallowEqual(nextProps);
  //
  //   return shouldUpdate || nextState !== this.state;
  // },
  //
  // shallowEqual(nextProps) {
  //   let {
  //     dataField,
  //     displayField,
  //   } = this.props;
  //   let cValue = this.state.value;
  //   let cVal = _.isObject(cValue) ? cValue[dataField] : cValue;
  //   let cText = _.isObject(cValue) && cValue[displayField];
  //   let nValue = nextProps.value;
  //   let nVal = _.isObject(nValue) ? nValue[dataField] : nValue;
  //   let nText = _.isObject(nValue) && nValue[displayField];
  //   let shouldUpdate = cValue !== nValue || cText !== nText;
  // },

  isChanged() {
    return this.state.isChanged();
  },

  isValid() {
    let valid = true;
    let { value } = this.props;
    if(this.props.required && !this.isChanged() && !value){
      valid = false;
    }
    return new Promise((res, rej) => {
      res(valid);
    });
  },

  clearValue() {
    this.setState({
      data: null,
    });
  },

  getValue() {
    let {
      dataField,
      displayField,
      value,
    } = this.props;

    let { data } = this.state;
    if(_.isObject(data)){
      value = data[dataField];
    }

    // value = {
    //   [displayField]: value[displayField],
    //   [dataField]: value[dataField],
    // };
    return value;
  },

  getStyles() {
    let styles = {
      root: {
        width: '256px',
        margin: '0 2px',
        float: 'left',
      },
      menu: {
        maxHeight: '300px',
      },
    };
     styles.menu = _.merge(styles.menu, this.props.menuStyle);
    return styles;
  },

  render() {
    let {
      dataField,
      disabled,
      displayField,
      floatingLabelText,
      floatingLabelStyle,
      hintText,
      nullItemText,
      style,
      underlineShow,
      width,
      margin,
      keyLabel,
      keyLabelStyle,
      value,
      ...other,
    } = this.props;

    let {
      entries,
      data,
      allStates,
    } = this.state;

    let styles = this.getStyles();
    let found = false;
    let val = _.isObject(data) && data[dataField] ? data[dataField] : data;
    let dataSource = [];
    _.forEach(entries, (e, i) => {
      if (val === e[dataField]) {
        found = true;
      }

      dataSource.push({
        text: e[displayField],
        value: e[dataField],
      });
    });

    if (_.isObject(data) && data[dataField] && data[displayField] && !found) {
      dataSource.push({
        text: data[displayField],
        value: data[dataField],
      });
    }

    if(entries && entries.length > 0 && !found){
      data = _.find(allStates, ['_id', val]);
    }

    return (
      <AutoComplete
        {...other}
        ref={(ref) => this.state = ref}
        dataSource={dataSource}
        disabled={disabled}
        filter={this._filter}
        floatingLabelText={floatingLabelText || this.t('nLabelStates')}
        hintText={hintText || this.t('nTextInputToFindStates')}
        nullItemText={nullItemText || this.t('nTextChooseStates')}
        onNewRequest={this._handleDropdownChange}
        onUpdateInput={(qry) => this._handleQueryChange(qry, data)}
        showNullItem={true}
        menuStyle={styles.menu}
        value={_.isObject(data) ? data[displayField] : data}
        floatingLabelStyle={floatingLabelStyle}
        style={style||styles.root}
        fullWidth={true}
        width={width}
        margin={margin}
        underlineShow={underlineShow}
        keyLabel={keyLabel}
        keyLabelStyle={keyLabelStyle}
      />
    );
  },

  _filter(searchText, key) {
    return true;
  },

  _fetchStates() {
    let { findStates } = global.api.epds;
    if (!_.isFunction(findStates)) {
      throw new Error(`api "findStates" is wrong: ${findStates}`)
    }

    findStates
    .promise({
      cursor: 0,
      size: -1,
      total: 0,
    },)
    .then(res => {
      let states = res.response.entries;
      this.setState({
        allStates: states,
        data: this.props.value,
      });
    })
    .catch(err => {
      console.error(err)
    });
  },

  _handleDropdownChange(chosenRequest, index, value) {
    let {
      dataField,
      displayField,
      onChange,
    } = this.props;

    if(this.props.onChange) { this.props.onChange(chosenRequest, index, value); }
    let data = {
        _id: chosenRequest && chosenRequest.value,
        name: chosenRequest && chosenRequest.text,
    };
    this.setState({data});
  },

  _handleQueryChange(qry, data){
    if(qry.length < MIN_KEY_LENGTH || qry.length > MAX_KEY_LENGTH) { return; }
    if (_.isFunction(searchStates)) {
      searchStates
        .promise({ query: { name: qry, size: 30 } })
        .then((res, rej) => {
          if(res.status == 'OK'){
            let entries = res.response.entries;
            this.setState({
              entries,
              data,
            });
          }
        })
        .catch(err => {});
    }
  },
});

module.exports = DropDownStatesInner;
// module.exports = connect(
//   (state) => {
//     return {};
//   },
//   {withRef: true},
// )(DropDownStatesInner);
