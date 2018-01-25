const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DragDropFiles = require('../../drag-drop-files');
const TextField = require('epui-md/TextField/TextField');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;

let SimpleMode = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode : PropTypes.string,
    style : PropTypes.object,
    order : PropTypes.object,
    orderEntry : PropTypes.object,
    productConfig : PropTypes.object,
    config: PropTypes.object,
    nLabelUploadArticleList : PropTypes.string,
    nLabelArticleList : PropTypes.string,
    nTextUploadPriceFiles:PropTypes.string,
    nTextPriceFiles:PropTypes.string,
  },

  getDefaultProps() {
    return {
      config: null,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let rootStyle = {
      margin: 'auto',
      padding: padding*7,
      textAlign: 'center',
    };
    if(this.props.style){
      _.merge(rootStyle, this.props.style);
    }
    let styles = {
      root:rootStyle,
      noteContainer:{
        textAlign: 'left',
        marginTop: 25,
      }
    };
    return styles;
  },

  isDirty(){
    return this.refs.articleFiles.isDirty() || this.refs.priceFiles.isDirty();
  },

  getDirtyFiles(){
    let dirtyFiles = [];
    if(this.refs.articleFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelArticleList'));
    }
    if(this.refs.priceFiles.isDirty()){
      dirtyFiles.push(this.t('nTextPriceFiles'));
    }
    return dirtyFiles;
  },

  getValue(){
    let { config } = this.props;
    return {
      files : this.refs.articleFiles.getFiles(),
      priceFiles : this.refs.priceFiles.getFiles(),
      remark : this.refs.note.getValue(),
      feedbackFiles: config.feedbackFiles,
      note: config.note,
    };
  },

  render() {
    let {config,order,mode,productConfig} = this.props;
    let articleFiles=null,priceFiles=null,note=null;
    if(config && config.files!==undefined){
      let loadedFiles =config.files;
      articleFiles = (
        <DragDropFiles
          key = 'articleFiles'
          ref = 'articleFiles'
          dropzoneStyle = {this.style('dropzone')}
          title = {this.t('nLabelUploadArticleList')}
          loadedFiles={loadedFiles}
          order ={this.props.order}
          orderEntry ={this.props.orderEntry}
          product = {this.props.orderEntry.product}
          productConfig = {this.props.productConfig}
          field ='files'
        />
      );
    }
    if(config && config.priceFiles!==undefined){
      let loadedPriceFiles =config.priceFiles;
      priceFiles=(
        <DragDropFiles
          key = 'priceFiles'
          ref = 'priceFiles'
          dropzoneStyle = {this.style('dropzone')}
          title = {this.t('nTextUploadPriceFiles')}
          loadedFiles={loadedPriceFiles}
          order ={this.props.order}
          orderEntry ={this.props.orderEntry}
          product = {this.props.orderEntry.product}
          productConfig = {this.props.productConfig}
          field ='priceFiles'
        />
      );
    }
    note=(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = 'note'
          key = 'note'
          floatingLabelText={this.t('nLabelNote')} 
          defaultValue = {config && config.remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );

    return (
      <div style = {this.style('root')}>
        {articleFiles}
        {priceFiles}
        {note}
      </div>
    );
   },

   _handleChange(){
     global.notifyOrderDetailsChange(true);
   },
});

module.exports = SimpleMode;
