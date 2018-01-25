const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const Remove = require('epui-md/svg-icons/content/clear');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
import IconButton from 'epui-md/IconButton';
import SvgDelete from 'epui-md/svg-icons/action/delete';
import SvgEdit from 'epui-md/svg-icons/image/edit';

const CompanyCard = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    editable: PropTypes.bool,
    companyInfo: PropTypes.object,
    style: PropTypes.object,
    title : PropTypes.string,
    onRemove : PropTypes.func,
    onEdit : PropTypes.func,
    nLabelCompanyName:PropTypes.string,
    nLabelCompanyAddress:PropTypes.string,
    nLabelCompanyPhone:PropTypes.string,
    nLabelPersonName:PropTypes.string,
    nLabelPersonPhone:PropTypes.string,
    nLabelPersonEmail:PropTypes.string,
  },

  getDefaultProps() {
    return {
      companyInfo: {},
      editable: true,
    };
  },

  getInitialState() {
    return{
      hover: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let containerStyle = {
      width: '100%',
      backgroundColor: 'rgb(237, 245, 254)',
      borderRadius: 2,
      padding: padding*10,
      marginBottom: 20,
      minHeight: 16,
    };
    if (this.props.style) {
      _.merge(containerStyle, this.props.style);
    }

    return {
      container: containerStyle,
      companyName: {
        textAlign: 'left',
        paddingBottom: padding*5,
        fontSize: 18,
        fontWeight: 500,
      },
      companyItem:{
        width: '40%',
        display: 'inline-block',
        marginBottom: padding * 5,
        marginRight : padding,
      },
      companyItemTitle:{
        fontSize: 14,
        fontWeight: 500,
        marginRight: padding * 5,
      },
      companyItemContent: {
        wordBreak: 'break-word',
      },
      actions:{
        float: 'right',
        marginTop: -15,
      },
      action:{
        color: theme.primary1Color,
        marginRight: padding,
        cursor: 'pointer',
        width: 30,
      },
      btn: {
        width: 18,
        height: 18,
        fill: '#f5a623',
      }
    };
  },

  renderCompanyInfo() {
    let companyInfo = this.props.companyInfo;

    return(
      <div>
        <div style = {this.style('companyItem')}>
          <span style = {this.style('companyItemTitle')}>{this.t('nLabelPersonName')+': '}</span>
          <span style = {this.style('companyItemContent')}>{companyInfo.personName}</span>
        </div>
        <div style = {this.style('companyItem')}>
          <span style = {this.style('companyItemTitle')}>{this.t('nLabelPersonPhone')+': '}</span>
          <span style = {this.style('companyItemContent')}>{companyInfo.personPhone}</span>
        </div>
        <div style = {this.style('companyItem')}>
          <span style = {this.style('companyItemTitle')}>{this.t('nLabelCompanyPhone')+': '}</span>
          <span style = {this.style('companyItemContent')}>{companyInfo.companyPhone}</span>
        </div>
        <div style = {this.style('companyItem')}>
          <span style = {this.style('companyItemTitle')}>{this.t('nLabelPersonEmail')+': '}</span>
          <span style = {this.style('companyItemContent')}>{companyInfo.personEmail}</span>
        </div>
        <div style = {this.style('companyItem')}>
          <span style = {this.style('companyItemTitle')}>{this.t('nLabelCompanyAddress')+': '}</span>
          <span style = {this.style('companyItemContent')}>{companyInfo.companyAddress}</span>
        </div>
      </div>
    );
  },

  renderCompanyName() {
    let companyInfo = this.props.companyInfo;

    return(
      <div style ={this.style('companyName')}>
        <div>{this._display(companyInfo.companyName)}</div>
      </div>
    );
  },

  render() {
    return(
      <Paper
        ref='companyInfo'
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        style={this.style('container')}
        zDepth={1}
      >
        <div style = {this.style('actions')}>
          <span onClick={this._handleClick}>
            <IconButton
              key='_edit'
              style={this.style('action')}
              iconStyle={this.style('btn')}
            >
              <SvgEdit style={this.style('btn')} />
            </IconButton>
          </span>
          <span onClick={this._handleRemoveTouch}>
            <IconButton
              key='_remove'
              style={this.style('action')}
              iconStyle={this.style('btn')}
            >
              <SvgDelete style={this.style('btn')} />
            </IconButton>
          </span>

        </div>
        {this.renderCompanyName()}
        {this.renderCompanyInfo()}
      </Paper>
    );
  },

  _display(string) {
    return string ? string : '-';
  },

  _handleMouseEnter() {
    if (this.props.editable) this.setState({hover: true});
  },

  _handleMouseLeave() {
    if (this.props.editable) this.setState({hover: false});
  },

  _handleRemoveTouch(e) {
    e.stopPropagation();
    global.notifyOrderDetailsChange(true);
    if (this.props.onRemove) {
      this.props.onRemove(this.props.companyInfo);
    }
  },

  _handleClick() {
    if (this.props.editable) {
      if (this.props.onEdit) {
        this.props.onEdit(this.props.companyInfo);
      }
    }
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});
module.exports = CompanyCard;
