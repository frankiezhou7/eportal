const React = require('react');
const Divider = require('epui-md/Divider');
const Paper = require('epui-md/Paper');
const moment = require ('moment');
const _ = require('eplodash');
const { FILES_URL } = require('~/src/gateway-urls');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const RegulationView = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    regulationItem : PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      active: 0,
    }
  },

  getDefaultProps() {
    return {
      regulationItem:{

      },
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      header:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        color: theme.epColor.primaryColor,
        marginBottom: 15,
      },
      source:{
        display: 'block',
        marginBottom: 15,
      },
      sourceContainer:{
        color: '#9b9b9b',
        fontSize: 14,
        marginBottom: 5,
      },
      time:{
        display: 'inline-block',
        marginLeft: 20,
        float: 'right',
      },
      title:{
        fontSize: 20,
        fontWeight: 500,
        wordBreak: 'break-word',
      },
      leftRoot:{
        padding: padding,
        marginTop: 10,
        marginRight: 10,
      },
      left:{
        maxWidth: '100%',
        marginRight: 20,
        width: '100%',
      },
      pic:{
        maxWidth: 500,
        maxHeight: 300,
        margin: 'auto',
        display: 'block',
        paddingTop: 30,
        width: '100%',
      },
      content:{
        marginTop: 40,
        fontSize: 16,
        lineHeight: 1.5,
        wordBreak: 'break-word',
      },
      regulationItem:{
        flex: '1 1 250px',
        marginRight: 10,
        minWidth: 250,
      },
      notExist:{
        padding: 40,
        textAlign: 'center',
        fontSize: 24,
        color: theme.epColor.primaryColor,
      },
      tag:{
        backgroundColor: '#159008',
        color: theme.epColor.whiteColor,
        borderRadius: 4,
        fontSize: 13,
        padding: 2,
        textAlign: 'center',
        minWidth: 35,
      },
      versionContainer: {
        margin: '10px 0px',
      },
      versionActive: {
        fontSize: 16,
        color: '#fff',
        letterSpacing: 0,
        background: '#F2B654',
        borderRadius: 2,
        padding: '6px 10px',
        cursor: 'pointer'
      },
      versionDefault: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.87)',
        letterSpacing: 0,
        borderRadius: 2,
        padding: '6px 10px',
        cursor: 'pointer'
      },
    }
    return styles;
  },

  render() {
    const headerStyle = this.style('header');
    const sourceStyle = this.style('source');
    const sourceContainerStyle = this.style('sourceContainer');
    const titleStyle = this.style('title');
    const timeStyle = this.style('time');
    const picStyle = this.style('pic');
    const contentStyle = this.style('content');
    const leftRootStyle = this.style('leftRoot');
    const rootStyle = this.style('root');
    const leftStyle = this.style('left');
    const regulationItem = this.props.regulationItem;
    const { active } = this.state;
    let ports = [];
    _.forEach(_.get(regulationItem,'ports',[]), port => {
      ports.push(_.capitalize(port.name));
    });
    let keypoint = _.isArray(regulationItem.keypoint) && regulationItem.keypoint.length > 0 &&
        regulationItem.keypoint.join(' ') || keypoint || '-';

    const headerElem = (
      <div style = {headerStyle}>
        <div>
          <div style = {titleStyle}>{regulationItem.title}</div>
        </div>
      </div>
    );

    const sourceElem = (
      <div style = {sourceContainerStyle}>
        <div style = {sourceStyle}>
          {`From: ${regulationItem.from}`}
          <div style = {timeStyle}>
            {regulationItem.dateCreate ? moment(regulationItem.dateCreate).format('YYYY-MM-DD') : ''}
          </div>
        </div>
        <div style = {sourceStyle}>
          <div>{`Keypoint: ${keypoint}`}</div>
          <div>{`Applicate Ports: ${ports.length > 0 ? ports.join(' ') : 'All Ports'}`}</div>
          <div>{`Effective Date: ${regulationItem.date ? moment(regulationItem.date).format('YYYY-MM-DD') : ''}`}</div>
        </div>
      </div>
    );

    const imgElem = regulationItem.pic ? (
        <img
          style = {picStyle}
          src = {FILES_URL + regulationItem.pic}
        />
    ):null;

    const contentElem = (
      <div style = {contentStyle} dangerouslySetInnerHTML={{__html: active ? regulationItem.chinese : regulationItem.english}} />
    );

    const newsElem = (
      <div>
        <div style={this.style('versionContainer')}>
          <span
            style={!active ? this.style('versionActive') : this.style('versionDefault')}
            onClick={this._handleChangeVersion.bind(this, 0)}
          >
            {`English`}
          </span>
          <span
            style={active ? this.style('versionActive') : this.style('versionDefault')}
            onClick={this._handleChangeVersion.bind(this, 1)}
          >
            {`中文版`}
          </span>
        </div>
        <Paper style = {this.style('leftRoot')}>
          {headerElem}
          {sourceElem}
          {imgElem}
          {contentElem}
        </Paper>
      </div>
    );

    return (
      <div style = {this.style('root')}>
        <div style = {this.style('left')}>
          {newsElem}
        </div>
      </div>
    );
  },

  _handleChangeVersion(versionType) {
    this.setState({active:versionType});
  },
});

module.exports = RegulationView;
