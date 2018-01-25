const React = require('react');
const DropZone = require('./drop-zone');
const Translatable = require('epintl');
const AutoStyle = require('epui/lib/mixins/auto-style');
const Paper = require('epui/lib/paper');
const FileWrapper = require('./file-wrapper');
const DefaultRawTheme = require('epui/lib/styles/raw-themes/light-raw-theme');
const ThemeManager = require('epui/lib/styles/theme-manager');
const Snackbar = require('epui/lib/snackbar');
const RaisedButton = require('epui/lib/raised-button');
const FileModel = require('./file-model');

const MAX_SIZE_IN_M = 5;
const VIDEO_MAX_SIZE_IN_M = 100;
const MAX_SIZE_RATE =1024*1024;
const IMAGE_TYPES = ['jpeg','jpg','bmp','png'];
const FILE_TYPES_ACCEPTED = ['jpeg','jpg','bmp','png','pdf','doc','docx','xls','xlsx'];
const VIDEO_TYPES_ACCEPTED = ['rm','rmvb','wmv','avi','mp4','3gp','mkv'];
const PropTypes = React.PropTypes;
const alt = require('epalt');
const metaHelper = alt.meta;
require('~/src/stores/segment-orders');
const actions = alt.findActions('segment-orders');

const DragAndDropFiles = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epintl/dist/Order/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    zDepth: PropTypes.number,
    title : PropTypes.string,
    style:PropTypes.object,
    titleStyle:PropTypes.object,
    dropzoneStyle: PropTypes.object,
    maxFileSize: PropTypes.number,
    maxVideoSize: PropTypes.number,
    nLabelDrapZoneInfo: PropTypes.string,
    nLabelViewDrapZoneInfo: PropTypes.string,
    nLabelUpload: PropTypes.string,
    nLabelIsUploading: PropTypes.string,
    nTextMaxmumSize: PropTypes.string,
    nTextFilesError: PropTypes.string,
    nTextFileTypeError:PropTypes.string,
    loadedFiles: PropTypes.array,
    postURL: PropTypes.string,
    fetchFileURL: PropTypes.string,
    fileTypeIconPath : PropTypes.string,
    fileTypeAccepted : PropTypes.array,
    videoTypeAccepted : PropTypes.array,
    onFilesChange:PropTypes.func,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    field: PropTypes.string,
    product:PropTypes.object,
    view : PropTypes.bool,
    acceptVideo : PropTypes.bool,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      zDepth: 0,
      title: '',
      view: false,
      maxFileSize: MAX_SIZE_IN_M,
      maxVideoSize: VIDEO_MAX_SIZE_IN_M,
      loadedFiles: [],
      fileTypeIconPath: '../images/',
      fileTypeAccepted: FILE_TYPES_ACCEPTED,
      videoTypeAccepted: VIDEO_TYPES_ACCEPTED,
      acceptVideo: false,
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      files: this.props.loadedFiles,
      errorFiles:'',
      uploadError:'',
      uploadCount: 0,
      maxSize: MAX_SIZE_IN_M
    };
  },

  getStyles(){
    let theme =  this.state.muiTheme;
    let height =100;
    let rootStyle = {
      backgroundColor: 'transparent',
      height: 'inherit',
      marginBottom: 8,
    };
    let titleStyle = {
      paddingBottom: 3,
      display: 'block',
      textAlign: 'left',
    };
    if(this.props.titleStyle){
      _.merge(titleStyle,this.props.titleStyle);
    }
    if(this.props.style){
      _.merge(rootStyle,this.props.style);
    }
    let dropzoneStyle ={
      minHeight: height,
    };
    if(this.props.dropzoneStyle){
      _.merge(dropzoneStyle,this.props.dropzoneStyle);
    }
    if(parseInt(dropzoneStyle.minHeight)<100){
      dropzoneStyle.minHeight= 100;
    }
    let styles = {
      root:rootStyle,
      title:titleStyle,
      fileContainer:{
        marginTop: 10,
      },
      fileWrapper:{
        marginTop: dropzoneStyle.minHeight*0.15/2,
        marginBottom: dropzoneStyle.minHeight*0.15/2,
        height: dropzoneStyle.minHeight*0.85,
      },
      file:{
        display:'inline-block',
        width: '100%',
        height:'100%',
      },
      dropzone:dropzoneStyle,
      emptyFileStyle:{
        padding: dropzoneStyle.minHeight/2 -10,
        textAlign: 'center',
      },
      snackbar:{
        height: 'inherit',
        lineHeight: '28px',
      },
      uploadContainer:{
        textAlign: 'right',
      },
      upload:{
        width: 'inherit',
      },
      buttonStyle:{
        borderRadius:'0 0 3px 3px',
      },
    };
    return styles;
  },

  checkNeedInitFiles(nextProps){
    let init = false;
    let preLoadedFiles = this.props.loadedFiles;
    let nextLoadedFiles = nextProps.loadedFiles;
    if(preLoadedFiles.length!==nextLoadedFiles.length) init=true;
    if(preLoadedFiles.length> 0 && nextLoadedFiles.length>0){
      if(!preLoadedFiles[0].init && !nextLoadedFiles[0].init) init =true;
    }
    return init;
  },

  componentWillReceiveProps(nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
    if(this.checkNeedInitFiles(nextProps)){
      this._initFiles(nextProps.loadedFiles);
    }

  },

  componentDidMount() {
    this.fetchOrderFilesURL();
  },

  fetchOrderFilesURL(){
    if(this.props.loadedFiles.length >0){
      let {order,orderEntry,productConfig,product,field} = this.props;
      let productConfigProductId = '';
      productConfig.products.map(productArr=>{
        if(productArr.get('product').get('_id') ===product.get('_id')){
          productConfigProductId = productArr.get('_id');
        }
      });
      actions.fetchOrderFilesURL(order._id,orderEntry._id,productConfig._id,productConfigProductId,product.get('_id'),field);
    }
  },

  onDrop(files){
    if(global.isOrderDetailsChanged()){
      this._onDropFile(files);
    }else{
      global.notifyOrderDetailsChange(true,()=>{
        this._onDropFile(files);
      });
    }
  },

  onOpenClick() {
    this.refs.dropzone.open();
  },

  getFiles(){
    let files = this.state.files;
    let values = _.map(files,file=>{
      return {
        id:file.id,
        name:file.name,
        url:file.url
      };
    });
    return values;
  },

  isUploading(){
    return this.isUploadingFileCount()>0;
  },

  isDirty(){
    return this.toUploadFileCount()>0;
  },

  checkUploadBtnStatus(){
    return  this.toUploadFileCount()===0||this.isUploading();
  },

  toUploadFileCount(){
    let files= this.state.files;
    let toUploadeFiles=[];
    _.forEach(files,file=>{
      if(file.toUpload){
        toUploadeFiles.push(file);
      }
    });
    return toUploadeFiles.length;
  },

  isUploadingFileCount(){
    let files= this.state.files;
    let uploadingFiles=[];
    _.forEach(files,file=>{
      if(file.isUploading){
        uploadingFiles.push(file);
      }
    });
    return uploadingFiles.length;
  },

  renderFiles(){
    let fileContainer = null;
    let {order,orderEntry,productConfig,field,product,view} = this.props;
    if(this.state.files.length>0){
      fileContainer =[];
      let files = this.state.files;
      for(let i=0, len =files.length; i<len; i++){
        let file = files[i];
        let isImg = _.includes(IMAGE_TYPES,file.extension);
        let isVideo = _.includes(VIDEO_TYPES_ACCEPTED,file.extension);
        let url =null;
        if(isImg){
          url = file.url;
        }else{
          try {
            url= file.extension ? require(`../images/${file.extension}.svg`): require(`../images/blank.svg`);
          } catch (e) {
            url= require(`../images/blank.svg`);
          }
        }
        let fileElem =(
          <img
            key ={file.url}
            src={url}
            style={this.style('file')}
          />
        );
        if(url){
          fileContainer.push(
            <FileWrapper
              ref ={file.url}
              key ={file.url}
              file={file}
              zDepth = {file.uploaded? 0 :1}
              style ={this.style('fileWrapper')}
              isUploading = {file.isUploading ? true :false}
              uploaded ={file.uploaded ? true :false}
              postURL= {this.props.postURL}
              onRemove ={this._handleRemoveClick}
              order={order}
              orderEntry={orderEntry}
              productConfig={productConfig}
              field={field}
              product={product}
              view={view}
            >
            {fileElem}
            </FileWrapper>
          );
        }
      }
    }else{
      fileContainer = (
        <div style = {this.style('emptyFileStyle')}>
          {this.props.view ? this.t('nLabelViewDrapZoneInfo'):this.t('nLabelDrapZoneInfo')}
        </div>
      );
    }
    return fileContainer;
  },

  renderUploadBtn(){
    if(this.props.view) return null;
    return (
      <div style={this.style('uploadContainer')}>
        <RaisedButton
          style={this.style('upload')}
          buttonStyle = {this.style('buttonStyle')}
          label={this.isUploadingFileCount()>0 ? this.t('nLabelIsUploading') : this.t('nLabelUpload')}
          primary={true}
          disabled={this.checkUploadBtnStatus()}
          onClick={this._handleUploadTouch}
        />
      </div>
    );
  },

  renderTitle(){
    return (
      <span style={this.style('title')}>{this.props.title}</span>
    );
  },

  render() {
    let errorMessage = this.t('nTextMaxmumSize') +this.state.maxSize +'M, '+this.t('nTextFilesError')+this.state.errorFiles;
    let fileTypes = this.props.fileTypeAccepted;
    if(this.props.acceptVideo){
      fileTypes = fileTypes.concat(this.props.videoTypeAccepted);
    }
    return (
      <Paper
        style = {this.style('root')}
        zDepth={this.props.zDepth}
      >
        {this.renderTitle()}
        <DropZone
          style = {this.style('dropzone')}
          ref="dropzone"
          onDrop={this.onDrop}
          view = {this.props.view}
        >
          {this.renderFiles()}
          {this.renderUploadBtn()}
        </DropZone>
        <Snackbar
          ref ='dragDropError'
          style = {this.style('snackbar')}
          message={errorMessage}
          autoHideDuration={0}
        />
        <Snackbar
          ref ='uploadError'
          style = {this.style('snackbar')}
          message={this.state.uploadError}
          autoHideDuration={0}
        />
        <Snackbar
          ref ='fileTypeError'
          style = {this.style('snackbar')}
          message={this.t('nTextFileTypeError')+ fileTypes.join(', ')}
          autoHideDuration={0}
        />
      </Paper>
    );
  },

  _handleRemoveClick(file){
    if(global.isOrderDetailsChanged()){
      this._removeFile(file);
    }else{
      global.notifyOrderDetailsChange(true,()=>{
        this._removeFile(file);
      });
    }
  },

  _removeFile(file){
    let files = this.state.files;
    let newFiles = _.reject(files,(f)=>{
      return f.id==file.id;
    });
    this.setState({
      files: newFiles,
    });
  },

  _onDropFile(files){
    let filesArr = this.state.files;
    let errorFiles ='';
    let fileTypeError = false;
    let maxSize = this.props.maxFileSize;
    let filterFiles = _.filter(files,(file)=>{
      let name = file.name;
      let extension = name.substring(name.lastIndexOf('.') + 1, name.length);
      if(!extension){
        fileTypeError=true;
        return false;
      }
      if(_.includes(this.props.videoTypeAccepted,extension.toLowerCase())){
        maxSize = this.props.maxVideoSize;
      }
      if(file.size > maxSize*MAX_SIZE_RATE){
        errorFiles += file.name + ', ';
      }
      let fileTypes = this.props.fileTypeAccepted;
      if(this.props.acceptVideo){
        fileTypes = fileTypes.concat(this.props.videoTypeAccepted);
      }
      if(!_.includes(fileTypes,extension.toLowerCase())){
        fileTypeError=true;
      }
      return file.size <= maxSize*MAX_SIZE_RATE && !fileTypeError;
    });
    filterFiles = _.map(filterFiles,file=>{
        return (new FileModel()).initDroppedFile(file);
    });
    filesArr = filesArr.concat(filterFiles);
    if(errorFiles.length>0){
      errorFiles = errorFiles.substring(0,errorFiles.length-2);
    }
    this.setState({
      files: filesArr,
      errorFiles: errorFiles,
      maxSize : maxSize
    },()=>{
      if(!fileTypeError && errorFiles.length>0){
        this.refs.dragDropError.show();
      }
      if(fileTypeError){
        this.refs.fileTypeError.show();
      }
    });
  },

  _handleUploadTouch(e){
    e.stopPropagation();
    let files = this.state.files;
    _.forEach(files,file=>{
      if(file.toUpload){
        file.isUploading = true;
        file.toUpload = false;
      }
    });
    this.setState({files:files});
  },

  // _handleUploadFailed(file,res,err){
  //   let files = this.state.files;
  //   _.map(files,f=>{
  //     if(f ===file){
  //       f.isUploading =false;
  //       f.uploaded =false;
  //       f.uploadError = err;
  //     }
  //   });
  //   this.setState({
  //     files:files,
  //     uploadError : err,
  //     uploadCount : this.state.uploadCount-1,
  //   },()=>{
  //     this.refs.uploadError.show();
  //   });
  // },
  //
  // _handleUploadSuccess(file,res){
  //   let files = this.state.files;
  //   let response = res.body.response.fileIDs;
  //   _.map(files,f=>{
  //     if(f ===file){
  //       f.isUploading =false;
  //       f.uploaded =true;
  //       f.id = response[file.field];
  //     }
  //   });
  //   this.setState({
  //     files:files,
  //     uploadCount : this.state.uploadCount-1,
  //   });
  // },

  _initFiles(files){
    files = _.uniq(files,'id');
    if(files.length > 0) {
      let loadedFiles = [];
      _.forEach(files, file => {
        let fileModel = (new FileModel()).initLoadedFile(file);
        loadedFiles.push(fileModel);
      });
      this.setState({
        files:loadedFiles
      });
    }
  },

  _handleFilesChange(){
    global.notifyOrderDetailsChange(true);
    if(this.props.onFilesChange) this.props.onFilesChange();
  },

});

module.exports = DragAndDropFiles;
