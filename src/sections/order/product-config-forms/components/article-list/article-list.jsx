const React = require('react');
const ArticleItem = require('./article-item');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const ArticleList = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    articles: PropTypes.array,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    renderArticleChild: PropTypes.func,
  },

  getDefaultProps() {
    return {
      articles: [],
    };
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    return {};
  },

  render() {
    let styles = this.getStyles();
    let articleElems = [];
    let articles = this.props.articles;

    _.forEach(articles,article => {
      let articleChild = null;
      articleElems.push(
        <ArticleItem
          article={article}
          key={article.id}
          articleChild={this.props.renderArticleChild ? this.props.renderArticleChild(article) : null}
          onEdit={this._handleEdit}
          onRemove={this._handleRemove}
        />
      );
    });

    return (
      <div>
        {articleElems}
      </div>
    );
  },

  _handleEdit(id) {
    if(this.props.onEdit) {
      this.props.onEdit(id);
    }
  },

  _handleRemove(id) {
    if(this.props.onRemove){
      this.props.onRemove(id);
    }
  },

});

module.exports = ArticleList;
