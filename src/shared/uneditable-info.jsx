const React = require('react');
const _ = require('eplodash');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const UneditableInfo = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    title: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.number,
    ]),
    style: PropTypes.object,
    titleStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    contactType: PropTypes.string,
    accountType: PropTypes.bool,
  },

  getDefaultProps(){
    return{

    };
  },

  getStyles() {
    let { style, titleStyle, contentStyle } = this.props;
    let styles = {
      root: {

      },
      title: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.56)',
        display: 'block',
        marginBottom: 5,
      },
      content: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.87)',
      },
    };
    styles.root = _.merge(styles.root, style);
    styles.title = _.merge(styles.title, titleStyle);
    styles.content = _.merge(styles.content, contentStyle);
    return styles;
  },

  render() {
    let { title, value, contactType, accountType } = this.props;
    if(_.isArray(value) && !!contactType) {value = this.convertContactsToValue(value,contactType);}
    if(_.isString(value) && accountType) {value = this.convertAccountTypeToValue(value);}
    return (
      <div style={this.style('root')}>
        <span style={this.style('title')}>{title}</span>
        <div style={this.style('content')}>{value}</div>
      </div>
    );
  },

  convertAccountTypeToValue(value){
    let type;
    if(_.toLower(value) === 'consignee') {
      type = 'Agent';
    }else if(_.toLower(value) === 'consigner'){
      type = 'Principal';
    }
    return type;
  },

  convertContactsToValue(methods,contactType){
    let typeCode = '';
    switch (contactType) {
      case 'mobile':
        typeCode = 'CMM';
        break;
      case 'email':
        typeCode = 'CME';
        break;
      case 'fax':
        typeCode = 'CMF';
        break;
      case 'phone':
        typeCode = 'CMP';
        break;
      case 'web':
        typeCode = 'CMW';
        break;
      default:

    }
    let obj = _.find(methods, {type: typeCode});
    let value = _.get(obj, 'value', '');
    return value;
  },
});

module.exports = UneditableInfo;
