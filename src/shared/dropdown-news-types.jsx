const React = require('react');
const _ = require('eplodash');
const AutoComplete = require('epui-md/ep/AutoComplete/AutoComplete');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const domain = require('~/src/store/domain');
const { connect } = require('react-redux');

const MIN_KEY_LENGTH = 2;

const DropDownNewsTypes = React.createClass({
  mixins: [Translatable],

  translations: require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),

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
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
      types: [],
      valid: true,
    };
  },

  componentWillMount() {
    this._fetchNewsTypes();
  },

  clearValue() {
    this.setState({
      value: null,
    });

    this.newsType.clearValue();
  },

  isValid() {
    let valid = true;
    if(this.props.required && !this.state.value) { valid = false };
    return new Promise((res, rej) => {
      this.setState({valid}, () => {res(valid);})
    });
  },

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

    return styles;
  },

  isChanged() {
    return this.newsType.isChanged();
  },

  render() {
    let {
      disabled,
      errorText,
      label,
      keyLabel,
      keyLabelStyle,
      ...others,
    } = this.props;
    let styles = this.getStyles();
    let dataSource = [];
    let { types, value, fullValue, allTypes, valid } = this.state;
    let val =  _.isObject(value) && value._id ? value._id : value;
    let found = false;

    if (types) {
      dataSource = [];
      types.forEach((e, i) => {
        dataSource.push({
          text: e.value,
          value: e._id,
        });
      });
    }else if(value){
      dataSource.push({
        text: fullValue.value,
        value: fullValue._id,
      });
    }

    if(allTypes && allTypes.length > 0){
      dataSource = [];
      allTypes.forEach((e, i) => {
        dataSource.push({
          text: e.value,
          value: e._id,
        });
      });
    }

    // types.forEach((type, i) => {
    //   found = (val && val === type._id) ? true : false;
    //   dataSource.push({
    //     text: type.value,
    //     value: type._id,
    //   });
    // });
    //
    // if (_.isObject(value) && value._id && value.value && !found && types.length === 0) {
    //   dataSource.push({
    //     text: value.value,
    //     value: value._id,
    //   });
    // }
    //
    // if(types && types.length > 0 && !found){
    //   value = _.find(allTypes, ['_id', val]);
    // }

    let menuProps = {
      maxHeight: 600,
    };

    return (
      <AutoComplete
        {...others}
        ref={(ref) => this.newsType = ref}
        dataSource={dataSource}
        disabled={disabled}
        errorText={!valid && this.t('nTextMustChooseNewsType')}
        filter={this._filter}
        floatingLabelStyle={styles.floatingLabelStyle}
        floatingLabelText={label || this.t('nTextNewsType')}
        foundText={this.t('nTextChooseNewsType')}
        hintText={this.t('nTextInputToFindNewsType')}
        labelStyle={styles.labelStyle}
        menuProps={menuProps}
        notFoundText={this.t('nTextNoNewsTypeFound')}
        nullItemText={this.t('nTextInputToFindNewsType')}
        onClose={this._handleClose}
        onNewRequest={this._handleDropdownChange}
        onUpdateInput={this._handleQueryChange}
        showNullItem={true}
        suggestionLabel={this.t('nTextSuggestedNewsType')}
        underlineStyle={styles.underlineStyle}
        value={_.isObject(value) ? value.value : value}
        keyLabel={keyLabel}
        keyLabelStyle={keyLabelStyle}
      />
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
      valid: true,
    });
  },

  _fetchNewsTypes() {
    let { findSettings } = global.api.epds;
    if (!_.isFunction(findSettings)) {
      throw new Error(`api "findPorts" is wrong: ${findSettings}`)
    }

    findSettings
    .promise({
      cursor: 0,
      size: -1,
      total: 0,
      query:{
        name: 'newsTypes'
      }
    },)
    .then(res => {
      let types = res.response.entries;
      // types = _.map(types, type=>{
      //   return {_id: type._id, name: type.value}
      // });
      this.setState({
        allTypes: types,
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

    let { searchNewsTypes } = global.api.epds;
    if (!_.isFunction(searchNewsTypes)) {
      throw new Error(`api "searchNewsTypes" is wrong: ${searchNewsTypes}`)
    }

    searchNewsTypes
    .promise({query: qry, size: 10 }, true)
    .then(res => {
      let types = res.response.entries;
      this.setState({
        types
      });
    })
    .catch(err => {
      console.error(err)
    });
  },
});

module.exports = DropDownNewsTypes;
