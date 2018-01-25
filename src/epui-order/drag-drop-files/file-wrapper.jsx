const React = require('react');
const AutoStyle = require('epui/lib/mixins/auto-style');
const Paper = require('epui/lib/paper');
const DefaultRawTheme = require('epui/lib/styles/raw-themes/light-raw-theme');
const ThemeManager = require('epui/lib/styles/theme-manager');
const RaisedButton = require('epui/lib/raised-button');
const CancelButton = require('epui/lib/svg-icons/navigation/cancel');
const DownloadButton = require('epui/lib/svg-icons/file/file-download');
const PureRenderMixin = React.addons.PureRenderMixin;
const agent = require('superagent');

const alt = require('epalt');
require('~/src/stores/segment-orders');
const actions = alt.findActions('segment-orders');
const PropTypes = React.PropTypes;

const FileWrapper = React.createClass({

  mixins: [AutoStyle,PureRenderMixin],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    zDepth: PropTypes.number,
    style: PropTypes.object,
    onRemove: PropTypes.func,
    isUploading : PropTypes.bool,
    uploaded : PropTypes.bool,
    order: PropTypes.object,
    orderEntry:PropTypes.object,
    productConfig: PropTypes.object,
    field: PropTypes.string,
    product:PropTypes.object,
    file:PropTypes.object,
    children:PropTypes.element,
    nTextRemove:PropTypes.string,
    nTextDownload:PropTypes.string,
    view: PropTypes.bool,
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      zDepth: 1,
      isUploading:false,
      uploaded:false,
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      hover:false,
      progress: 0,
      zDepth:this.props.zDepth,
    };
  },

  getStyles(){
    let theme = this.state.muiTheme;
    let height = 170;
    let rate = 1.4142857142857;
    let padding = 5;
    let coverOpacity =0.9;
    let width = parseInt(height/rate);
    let paperStyle ={
      width: width,
      height: height,
      padding: padding,
      marginLeft: 2*padding,
    };
    if(this.props.style) _.merge(paperStyle,this.props.style);
    if(this.props.style.height && !this.props.style.width){
      paperStyle.width = parseInt(parseInt(this.props.style.height)/rate);
    }
    let coverStyle ={
      opacity : coverOpacity,
      backgroundColor: theme.palette.greyColor,
      width:paperStyle.width,
      height: paperStyle.height-24,
      borderRadius: '3px 3px 0px 0px',
      textAlign: 'center',
    };
    let hoverStyle={
      marginTop : -parseInt(paperStyle.height)-parseInt(paperStyle.marginBottom),
      width:paperStyle.width,
      height: paperStyle.height,
      marginLeft: parseInt(paperStyle.marginLeft),
      display: this.state.hover ? 'block': 'none',
      overflow: 'hidden',
      marginBottom: paperStyle.marginBottom,
    };
    let styles ={
      root:{
        cursor: 'pointer',
        display:'inline-block',
        verticalAlign: 'top',
      },
      button:{
        verticalAlign: 'bottom',
        opacity : coverOpacity,
        backgroundColor: theme.palette.greyColor,
        fill: theme.palette.accent1Color,
      },
      actions:{
        opacity : coverOpacity,
        backgroundColor: theme.palette.greyColor,
      },
      fileName:{
        color : theme.palette.canvasColor,
        fontWeight: 500,
        wordBreak: 'break-word',
        paddingTop: coverStyle.height/2-10 > 0 ? coverStyle.height/2-10 :0,
        display: 'block',
      },
      loadingBar:{
        width: paperStyle.width*(this.state.progress/100),
        height: 1,
        backgroundColor: theme.palette.accent1Color,
        borderColor: 'transparent',
        marginTop: -1,
        marginLeft: -padding,
        display: this.props.isUploading? 'block': 'none',
      },
      paper:paperStyle,
      cover:coverStyle,
      hover:hoverStyle,
    };
    return styles;
  },

  componentWillReceiveProps(nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
    if(!this.props.isUploading && !this.props.uploaded && nextProps.isUploading){
      this.uploadFile();
    }
  },

  uploadFile(){
    let {order,orderEntry,productConfig,product,field,file} = this.props;
    let productConfigProductId = '';
    productConfig.products.map(productArr=>{
      if(productArr.get('product').get('_id') ===product.get('_id')){
        productConfigProductId = productArr.get('_id');
      }
    });
    actions.storeOrderFile(order.get('_id'),orderEntry.get('_id'),productConfig.get('_id'),productConfigProductId,product.get('_id'),field,file,file.file,this._onProgress);
    // agent
    //   .post(this.props.postURL)
    //   .attach(file.field,file.file,file.file.name)
    //   .on('progress',(e)=>{
    //     this.setState({
    //       progress: parseInt(e.percent)
    //     });
    //   })
    //   .end((err,res)=>{
    //     if(err){
    //       this.notifyUploadFailed(err,res);
    //     }else{
    //       this.notifyUploadSuccess(res);
    //     }
    //   });
  },

  // notifyUploadFailed(err,res){
  //   if(this.props.onUploadFailed){
  //     this.props.onUploadFailed(this.props.file,res,err);
  //   }
  // },
  //
  // notifyUploadSuccess(res){
  //   if(this.props.onUploadSuccess){
  //     this.props.onUploadSuccess(this.props.file,res);
  //   }
  // },

  render() {
    let cancelBtn =this.props.view ? null:(
      <CancelButton
        title ={this.props.nTextRemove}
        style={this.style('button')}
        onClick={this._handleRemoveTouch}
      />
    );
    let downloadBtn = (
      <a
        href = {this.props.file.url}
        title ={this.props.nTextDownload}
        download
      >
        <DownloadButton
          style={this.style('button')}
        />
      </a>
    );
    return (
      <div
        style ={this.style('root')}
        onMouseOver= {this._handleMouseOver}
        onMouseOut= {this._handleMouseOut}
        onClick={this._handleFileClick}
      >
        <Paper
          style ={this.style('paper')}
          zDepth={this.props.zDepth}
        >
          {this.props.children}
          <hr style ={this.style('loadingBar')}/>
        </Paper>
        <div style ={this.style('hover')}>
          <div style= {this.style('cover')}>
            <span style ={this.style('fileName')}>
              {this.props.file.name}
            </span>
          </div>
          <div style ={this.style('actions')}>
            {cancelBtn}
            {downloadBtn}
          </div>
        </div>
      </div>
    );
  },

  _handleMouseOver(){
    if(!this.state.hover){
      this.setState({
        hover : true
      });
    }
  },

  _handleMouseOut(){
    if(this.state.hover){
      this.setState({
        hover : false
      });
    }
  },

  _onProgress(precent){
    this.setState({progress : precent});
  },

  _handleFileClick(e){
    e.stopPropagation();
  },

  _handleRemoveTouch(e){
    e.stopPropagation();
    if(this.props.onRemove){
      this.props.onRemove(this.props.file);
    }
  },

});

module.exports = FileWrapper;
