const React = require('react');
const _ = require('eplodash');
const Paper = require('epui-md/Paper');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const RichEditor = require('epui-rich-editor');
const NewsTypes = require('~/src/shared/news-types');
const DropDownNewsTypes = require('~/src/shared/dropdown-news-types');
const { FILES_URL } = require('~/src/gateway-urls');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

const NewsEditor = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),
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

  getValue(){
    let news = this.props.newsItem;
    news.title = this.refs.title.getValue();
    news.summary = this.refs.summary.getValue();
    news.content = this.refs.editor.html();
    news.editor = this.refs.editor.getValue();
    news.from = this.refs.from.getValue();
    news.type = this.refs.type.getValue();
    return news;
  },

  isValid(){
    return Promise.all([
      this.refs.title.isValid(),
      this.refs.type.isValid(),
      this.refs.summary.isValid(),
    ]);
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{

      },
      textField:{
        marginTop: 10,
      },
      editor:{
        width: '100%',
        marginTop: 10,
        boxShadow: 'none',
      },
      newsType: {
        margin: '15px 0px 10px',
      },
    }
    return styles;
  },

  render() {
    const newsItem = this.props.newsItem;
    const editorValue = newsItem.editor;
    const uploadPromise = global.api.epds && global.api.epds.storeNewsFile ? global.api.epds.storeNewsFile.promise : null;
    if(editorValue && !editorValue.entityMap) editorValue.entityMap = {};
    return (
      <div style = {this.style('root')}>
        <TextField
          style = {this.style('textField')}
          ref = 'title'
          hintText = 'News Title'
          fullWidth = {true}
          required = {true}
          defaultValue = {newsItem && newsItem.title}
        />
        <DropDownNewsTypes
          ref = 'type'
          value={newsItem && newsItem.type}
          required = {true}
        />
        {/*<NewsTypes
          ref = 'type'
          label='News Type'
          value={newsItem && newsItem.type}
          required = {true}
          style={this.style('newsType')}
        />*/}
        <TextField
          style = {this.style('textField')}
          ref = 'summary'
          hintText = 'News Summary'
          fullWidth = {true}
          multiLine={true}
          rows={1}
          required = {true}
          defaultValue = {newsItem && newsItem.summary}
        />
        <TextField
          style = {this.style('textField')}
          ref = 'from'
          hintText = 'From'
          fullWidth = {true}
          multiLine={true}
          rows={1}
          defaultValue = {newsItem && newsItem.from}
        />
        <RichEditor
          style = {this.style('editor')}
          ref = 'editor'
          upload = {uploadPromise}
          defaultValue = {editorValue}
        />
      </div>
    );
  }

});

module.exports = NewsEditor;
