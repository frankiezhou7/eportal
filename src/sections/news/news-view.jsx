const React = require('react');
const Divider = require('epui-md/Divider');
const Paper = require('epui-md/Paper');
const NewsItem = require ('epui-md/ep/news/NewsItem');
const moment = require ('moment');
const _ = require('eplodash');
const { FILES_URL } = require('~/src/gateway-urls');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const News = React.createClass({

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
    newsItem : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      newsItem:{

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
        display: 'inline-block',
      },
      sourceContainer:{
        color: '#9b9b9b',
        fontSize: 14,
        marginBottom: 5,
      },
      time:{
        display: 'inline-block',
        marginLeft: 20,
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
      newsItem:{
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
    const newsItem = this.props.newsItem;

    const headerElem = (
      <div style = {headerStyle}>
        <div>
          <div style = {titleStyle}>{newsItem.title}</div>
        </div>
      </div>
    );

    const sourceElem = (
      <div style = {sourceContainerStyle}>
        <div style = {sourceStyle}>{`From ${newsItem.from || '-'}`}</div>
        <div style = {timeStyle}>
          {this.props.newsItem.dateUpdate ? moment(this.props.newsItem.dateCreate).format('YYYY-MM-DD') : ''}
        </div>
      </div>
    );

    const imgElem = newsItem.pic ? (
        <img
          style = {picStyle}
          src = {FILES_URL + newsItem.pic}
        />
    ):null;

    const contentElem = (
      <div style = {contentStyle} dangerouslySetInnerHTML={{__html: newsItem.content}} />
    );

    const newsElem = (
      <Paper style = {this.style('leftRoot')}>
        {headerElem}
        {sourceElem}
        {imgElem}
        {contentElem}
      </Paper>
    );

    return (
      <div style = {this.style('root')}>
        <div style = {this.style('left')}>
          {newsElem}
        </div>
      </div>
    );
  }

});

module.exports = News;
