const React = require('react');
const ArticleList = require('../components/article-list');
const AutoStyle = require('epui-auto-style').mixin;
const AddButton = require('epui-md/svg-icons/content/add');
const FlatButton = require('epui-md/FlatButton');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const Dialog = require('epui-md/Dialog');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const TextField = require('epui-md/TextField/TextField');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;

const DetailMode = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    config: PropTypes.object,
    articleTypes: PropTypes.object,
    nTextAddArticle: PropTypes.string,
    nTextCancel: PropTypes.string,
    nTextAdd: PropTypes.string,
    nTextAddArticleInfo: PropTypes.string,
    nLabelArticleCount: PropTypes.string,
    nLabelArticleDescription: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nTextEditArticleInfo: PropTypes.string,
    nLabelArticleName: PropTypes.string,
    nLabelCountUnit: PropTypes.string,
    nLabelArticleDetail: PropTypes.string,
    open: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      articleTypes: null,
      config: null,
      open: false,
    };
  },

  getInitialState() {
    let articles = [];
    let {
      config,
      open,
    } = this.props;

    if(config && config['articles']) {
      articles= config['articles'];
    }

    return {
      articles: articles,
      editArticle: {},
      open: open,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let rootStyle= {
      padding: padding * 7,
      marginBottom: padding * 5,
    };
    if(this.props.style) {
      _.merge(rootStyle,this.props.style);
    }
    let styles = {
      root: rootStyle,
      addBtn: {
        width: 160,
        textAlign: 'center',
        margin: 'auto',
      },
      addBtn:{
        textAlign: 'center',
        margin: 'auto',
      },
      addBtnLabel:{
        marginLeft: padding*5,
        fontSize: 16,
        color: '#f5a623',
        verticalAlign: 'middle',
      },
      menu: {
        display: 'inline-block',
        width: 200,
        verticalAlign: 'bottom',
        textAlign: 'left',
      },
      underlineStyle: {
        marginTop: -9,
      },
      articleCount: {
        marginRight: padding * 5,
        display: 'inline-block',
        width: 120,
        verticalAlign: 'bottom',
      },
      articleCountUnit: {
        marginLeft: 10,
        display: 'inline-block',
        height: 55,
        width: 150,
        verticalAlign: '4px',
      },
      articleCountUnderLine: {
        marginBottom: 2,
      },
      articleDescription: {
        marginRight: padding * 5,
        display: 'inline-block',
        width: 720,
        verticalAlign: 'middle',
      },
      articleId: {
        display: 'none',
      },
      articleChildHalf: {
        width: '40%',
        display: 'inline-block',
        marginBottom: padding * 5,
        marginRight: padding,
      },
      articleChildTitle: {
        fontSize: 14,
        fontWeight: 500,
        marginRight: padding * 5,
        display: 'inline-block',
        verticalAlign: 'top',
      },
      articleChildDescription: {
        maxWidth: 610,
        verticalAlign: 'middle',
        wordBreak: 'break-word',
        display: 'inline-block',
        textAlign: 'justify',
      },
      detailTitle: {
        paddingTop: padding * 2,
        paddingBottom: padding * 4,
        fontSize: 15,
        fontWeight: 500,
      },
      button: {
        width: 18,
        height: 18,
        verticalAlign: 4,
        fill: '#fff',
      },
      circle: {
        width: 18,
        height: 18,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        backgroundColor: '#f5a623',
      }
    };
    return styles;
  },

  componentWillReceiveProps(nextProps) {},

  isDirty() {},

  getValue() {
    return this.state.articles;
  },

  renderAddBtn() {
    return (
      <div style = {this.style('addBtn')}>
        <FlatButton
          onTouchTap={this._handleAddTouch}
          backgroundColor={'rgba(0,0,0,0)'}
          >
          <span style={this.style('circle')}>
            <AddButton style={this.style('button')}/>
          </span>
          <span style = {this.style('addBtnLabel')}>{this.t('nTextAddPurchasesArticle')}</span>
        </FlatButton>
      </div>
    );
  },

  renderArticleChild(article) {
    return (
      <div>
        <div style={this.style('articleChildHalf')}>
          <span style={this.style('articleChildTitle')}>{this.t('nLabelArticleName') + ': '}</span>
          <span>{article.type.name}</span>
        </div>
        <div style={this.style('articleChildHalf')}>
          <span style={this.style('articleChildTitle')}>{this.t('nLabelArticleCount') + ': '}</span>
          <span style={this.style('articleChildContent')}>{article.count}</span>
        </div>
        <div style={{minHeight:'3px'}}></div>
        <div>
          <span style={this.style('articleChildTitle')}>{this.t('nLabelArticleDescription') + ': '}</span>
          <span style={this.style('articleChildDescription')}>{article.description}</span>
        </div>
      </div>
    );
  },

  renderArticleList() {
    return (
      <ArticleList
        ref='articleList'
        articles={this.state.articles}
        onEdit={this._handleEditArticle}
        onRemove={this._handleRemoveArticle}
        renderArticleChild={this.renderArticleChild}
      />
    );
  },

  renderAddDialog(article) {
    let { articleTypes } = this.props;
    let isAdd = false;
    let id = article ? article.id : '';
    if(!id) {
      id = Math.random() * 10001;
      isAdd = true;
    }
    let count = article ? article.count : '';
    let description = article ? article.description : '';
    let articleType = article ? article.type : {};
    let value = (articleType && articleType._id) || (articleTypes && articleTypes.get(0) && articleTypes.get(0).get('_id'));
    let menuItems = [];
    if(articleTypes && articleTypes.size > 0) {
      articleTypes.forEach(articleType => {
        let id = articleType.get('_id');
        let name = articleType.get('name');

        menuItems.push(
          <MenuItem key={id} value={id} primaryText={name} />,
        );
      });
    }

    let addActions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleArticleDialogCancel}
      />,
      <FlatButton
        key='submit'
        label={isAdd ? this.t('nTextSave') : this.t('nLabelEdit')}
        primary={true}
        onTouchTap={this._handleArticleDialogSubmit}
      />,
    ];

    return (
      <Dialog
        ref='articleDialog'
        title={isAdd ? this.t('nTextAddArticleInfo') : this.t('nTextEditArticleInfo')}
        actions={addActions}
        onRequestClose={this._handleRequestClose}
        open={this.state.open}
      >
        <DropDownMenu
          ref='articleType'
          key='articleType'
          style={this.style('menu')}
          underlineStyle={this.style('underlineStyle')}
          maxHeight={135}
          value={value}
          onChange={this._handleArticleTypeChange}
        >
          {menuItems}
        </DropDownMenu>
        <TextFieldUnit
          ref='articleCount'
          key='articleCount'
          defaultValue={count}
          floatingLabelText={this.t('nLabelArticleCount')}
          style={this.style('articleCountUnit')}
          underlineStyle={this.style('articleCountUnderLine')}
          unitLabelText={this.t('nLabelCountUnit')}
        />
        <TextField
          ref='articleDescription'
          key='articleDescription'
          style={this.style('articleDescription')}
          defaultValue={description}
          floatingLabelText={this.t('nLabelArticleDescription')}
        />
        <TextField
          ref='articleId'
          key='articleId'
          style={this.style('articleId')}
          defaultValue={id}
        />
      </Dialog>
    );
  },

  renderTitle() {
    return (
      <div style={this.style('detailTitle')}>
        {this.t('nLabelArticleDetail')}
      </div>
    );
  },

  render() {
    return (
      <div style={this.style('root')}>
        {this.renderTitle()}
        {this.renderArticleList()}
        {this.renderAddBtn()}
        {this.renderAddDialog(this.state.editArticle)}
      </div>
    );
   },

  _getArticleNameById(id) {
    let name = '';
    if (this.props.articleTypes && this.props.articleTypes.size > 0) {
      this.props.articleTypes.forEach(articleType => {
        if (id === articleType.get('_id')) {
          name = articleType.get('name');
        }
      });
    }
    return name;
  },

  _getArticleDialogValue() {
    let _id = this.refs.articleType ? this.refs.articleType.getValue() : '';
    let name = this._getArticleNameById(_id);

    return {
      id: this.refs.articleId ? this.refs.articleId.getValue() : '',
      type: {
        _id: _id,
        name: name
      },
      count: this.refs.articleCount ? this.refs.articleCount.getValue() : '',
      description: this.refs.articleDescription ? this.refs.articleDescription.getValue() : ''
    };
  },

  _handleAddTouch() {
    let newArticle = {
      type: {
        _id: '',
        name: ''
      },
      count: '',
      description: ''
    };

    this.setState({
      editArticle: newArticle,
      open: true,
    });
  },

  _handleArticleDialogCancel() {
    this.setState({
      open: false,
    });
  },

  _handleArticleDialogSubmit() {
    let dialogValue = this._getArticleDialogValue();
    let articles = this.state.articles;
    let isAdd = true;
    articles = _.map(articles, article => {
      if (article.id === dialogValue.id) {
        isAdd = false;
        article = dialogValue;
      }
      return article;
    });
    if (isAdd) {
      articles.push(dialogValue);
    }

    this.setState({
      articles: articles,
      editArticle: {},
      open: false,
    }, () => {
      global.notifyOrderDetailsChange(true);
    });
  },

  _handleEditArticle(id) {
    let eidtArticle = null;
    let articles = this.state.articles;
    _.forEach(articles, article => {
      if (article.id === id) {
        eidtArticle = article;
      }
    });

    this.setState({
      editArticle: eidtArticle,
      open: true,
    });
  },

  _handleRemoveArticle(id) {
    let articles = this.state.articles;
    articles = _.reject(articles, ['id', id]);

    this.setState({articles: articles});
  },
});

module.exports = DetailMode;
