const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropZone = require('./drop-zone');
const FileModel = require('./file-model');
const FileWrapper = require('./file-wrapper');
const Paper = require('epui-md/Paper');
const FileUpload = require('epui-md/svg-icons/file/file-upload');
const PropTypes = React.PropTypes;
const FlatButton = require('epui-md/FlatButton');
const Snackbar = require('epui-md/Snackbar');
const Translatable = require('epui-intl').mixin;
const FILE_TYPES_ACCEPTED = [ 'jpeg', 'jpg', 'bmp', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx' ];
const IMAGE_TYPES = ['jpeg', 'jpg', 'bmp', 'png'];
const MAX_SIZE_IN_M = 5;
const MAX_SIZE_RATE = 1024 * 1024;
const VIDEO_MAX_SIZE_IN_M = 50;
const VIDEO_TYPES_ACCEPTED = [ 'rm', 'rmvb', 'wmv', 'avi', 'mp4', '3gp', 'mkv' ];

const DragAndDropFiles = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Order/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    acceptVideo: PropTypes.bool,
    disableClick: PropTypes.bool,
    dropzoneStyle: PropTypes.object,
    fetchOrderFilesURL: PropTypes.func,
    field: PropTypes.string,
    fileTypeAccepted: PropTypes.array,
    fileTypeIconPath: PropTypes.string,
    loadedFiles: PropTypes.array,
    maxFileSize: PropTypes.number,
    maxVideoSize: PropTypes.number,
    nLabelDrapZoneInfo: PropTypes.string,
    nLabelIsUploading: PropTypes.string,
    nLabelUpload: PropTypes.string,
    nLabelViewDrapZoneInfo: PropTypes.string,
    nTextFileTypeError: PropTypes.string,
    nTextFilesError: PropTypes.string,
    nTextMaxmumSize: PropTypes.string,
    onFilesChange: PropTypes.func,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    postURL: PropTypes.string,
    product: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    videoTypeAccepted: PropTypes.array,
    view: PropTypes.bool,
    zDepth: PropTypes.number,
    usage: PropTypes.string,
    onDropFiles: PropTypes.func,
    onUploadFiles: PropTypes.func,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    onRemoveFiles: PropTypes.func,
  },

  getDefaultProps() {
    return {
      acceptVideo: false,
      fileTypeAccepted: FILE_TYPES_ACCEPTED,
      fileTypeIconPath: '../images/',
      loadedFiles: [],
      maxFileSize: MAX_SIZE_IN_M,
      maxVideoSize: VIDEO_MAX_SIZE_IN_M,
      title: '',
      videoTypeAccepted: VIDEO_TYPES_ACCEPTED,
      view: false,
      zDepth: 0,
    };
  },

  getInitialState() {
    return {
      dragDropErrorOpen: false,
      errorFiles: '',
      fileTypeErrorOpen: false,
      files: _.isArray(this.props.loadedFiles) ? this.props.loadedFiles : [],
      maxSize: MAX_SIZE_IN_M,
      uploadCount: 0,
      uploadError: '',
      uploadErrorOpen: false,
      removed: false,
      dropped: false,
    };
  },

  componentWillMount() {
    this._initFiles(this.props.loadedFiles);
  },

  getStyles() {
    let theme = this.state.muiTheme;
    let height = 150;
    let rootStyle = {
      backgroundColor: 'transparent',
      height: 'inherit',
      marginBottom: '8px',
    };
    let titleStyle = {
      marginTop: 30,
      paddingBottom: 14,
      display: 'block',
      textAlign: 'left',
      fontSize: 15,
    };
    if (this.props.titleStyle) {
      _.merge(titleStyle, this.props.titleStyle);
    }
    if (this.props.style) {
      _.merge(rootStyle, this.props.style);
    }
    let dropzoneStyle = {
      backgroundColor: '#ededed',
      minHeight: height,
    };
    if (this.props.dropzoneStyle) {
      _.merge(dropzoneStyle, this.props.dropzoneStyle);
    }
    if (parseInt(dropzoneStyle.minHeight) < 100) {
      dropzoneStyle.minHeight = 100;
    }
    let styles = {
      root: rootStyle,
      title: titleStyle,
      fileContainer: {
        marginTop: '10px',
      },
      fileWrapper: {
        marginTop: dropzoneStyle.minHeight * 0.10 / 2,
        marginBottom: dropzoneStyle.minHeight * 0.10 / 2,
        width: 130,
        height: dropzoneStyle.minHeight * 0.5734,
        padding: 0,
      },
      file: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
      },
      dropzone: dropzoneStyle,
      emptyFileStyle: {
        padding: dropzoneStyle.minHeight / 2 - 10,
        textAlign: 'center',
        fontSize: 14,
        color: '#4a4a4a',
      },
      snackbar: {
        height: 'inherit',
        lineHeight: '28px',
      },
      uploadContainer: {
        width: '100%',
        height: 46,
      },
      uploadedContainer: {
        marginTop: 19,
        width: '100%',
      },
      upload: {
        width: 'inherit',
      },
      buttonStyle: {
        borderRadius: '0 0 3px 3px',
      },
      icon: {
        width: 24,
        color: '#858585',
        marginTop: 11,
      },
      iconUploaded: {
        width: 24,
        color: '#fff',
        marginTop: 11,
      },
    };

    return styles;
  },

  checkNeedInitFiles(nextProps) {
    let init = false;
    let preLoadedFiles = this.props.loadedFiles;
    let nextLoadedFiles = nextProps.loadedFiles;
    if (preLoadedFiles.length !== nextLoadedFiles.length){
      init = true;
    }else{
      if (preLoadedFiles.length > 0 && nextLoadedFiles.length > 0) {
        for(let i = 0, len = preLoadedFiles.length; i<len; i++){
          if(preLoadedFiles[i].id && preLoadedFiles[i].id !== nextLoadedFiles[i].id) {
            init = true;
            break;
          }
        }
      }
    }
    return init;
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.checkNeedInitFiles(nextProps)) {
      this._initFiles(nextProps.loadedFiles);
    }
  },

  onDrop(files) {
    let { onDropFiles, onChange } = this.props;
    this._onDropFile(files);
    if(_.isFunction(onDropFiles)){
      onDropFiles();
    }
    this.setState({dropped:true},() => {
      if(_.isFunction(onChange)){
        onChange();
      }
    });

  },

  onOpenClick() {
    this.refs.dropzone.open();
  },

  getFiles() {
    let files = this.state.files;
    let uniqFiles = _.uniqBy(files, 'id');
    let values = _.map(uniqFiles, file => {
      return {
        id: file.id,
        name: file.name,
        url: file.url,
      };
    });

    return values;
  },

  isUploading() {
    return this.isUploadingFileCount() > 0;
  },

  isDirty() {
    return this.toUploadFileCount() > 0;
  },

  isValid() {
    return !this.isDirty() && this.getFilesCount() > 0;
  },

  getFilesCount() {
     return this.isChanged() ? this.state.files.length : this.props.loadedFiles && this.props.loadedFiles.length > 0 ? this.props.loadedFiles.length : this.state.files.length;
  },

  isChanged() {
    return _.compact([this.state.removed,this.state.dropped]).length > 0;
  },

  checkRemovedStatus(){
    return this.state.removed;
  },

  checkDroppedStatus(){
    return this.state.dropped;
  },

  checkUploadBtnStatus() {
    return this.toUploadFileCount() === 0 || this.isUploading();
  },

  toUploadFileCount() {
    let files = this.state.files;
    let toUploadeFiles = [];
    _.forEach(files, file => {
      if (file.toUpload) {
        toUploadeFiles.push(file);
      }
    });
    return toUploadeFiles.length;
  },

  isUploadingFileCount() {
    let files = this.state.files;
    let uploadingFiles = [];
    _.forEach(files, file => {
      if (file.isUploading) {
        uploadingFiles.push(file);
      }
    });
    return uploadingFiles.length;
  },

  renderFiles() {
    let fileContainer = null;
    let {
      order,
      orderEntry,
      productConfig,
      field,
      product,
      view,
      usage
    } = this.props;
    let { files } = this.state;
    let len = files ? files.length : 0;
    if (len > 0) {
      fileContainer = [];
      for (let i = 0; i < len; i++) {
        let file = files[i];
        let isImg = _.includes(IMAGE_TYPES, file.extension);
        let isVideo = _.includes(VIDEO_TYPES_ACCEPTED, file.extension);
        let url = null;
        if (isImg) {
          url = file.id ? '/files/'+file.id : file.url;
        } else {
          try {
            url = file.extension ? require(`../images/${file.extension}.svg`) : require(`../images/blank.svg`);
          } catch (e) {
            url = require(`../images/blank.svg`);
          }
        }
        let fileElem = (
          <img
            key={file.url}
            src={url}
            style={this.style('file')}
          />
        );

        if (url) {
          fileContainer.push(
            <FileWrapper
              {...this.props}
              ref={file.url}
              key={file.url}
              field={field}
              file={file}
              isUploading={file.isUploading ? true : false}
              onRemove ={this._handleRemoveClick}
              order={order}
              orderEntry={orderEntry}
              postURL={this.props.postURL}
              product={product}
              productConfig={productConfig}
              style={this.style('fileWrapper')}
              uploaded={file.uploaded ? true : false}
              view={view}
              zDepth={file.uploaded ? 0 : 1}
              onUploadComplete={this._handleUploadComplete}
              usage={usage}
            >
              {fileElem}
            </FileWrapper>
          );
        }
      }
    } else {
      fileContainer = (
        <div style={this.style('emptyFileStyle')}>
          {this.props.view ? this.t('nLabelViewDrapZoneInfo') : this.t('nLabelDrapZoneInfo')}
        </div>
      );
    }

    return fileContainer;
  },

  renderUploadBtn() {
    if(this.props.view) { return null; }
    let { files } = this.state;
    let len = files ? files.length : 0;

    return (
      <div style={len > 0 ? this.style('uploadedContainer') : this.style('uploadContainer')}>
        <FlatButton
          backgroundColor= {this.isDirty() ? '#f5a623' : '#d8d8d8'}
          disabled={this.checkUploadBtnStatus()}
          onClick={this._handleUploadTouch}
          buttonHeight={46}
          primary={true}
          style={this.style('upload')}>
            <FileUpload style={this.isDirty() ? this.style('iconUploaded') : this.style('icon')}/>
        </FlatButton>
      </div>
    );
  },

  renderTitle() {
    return (
      <span style={this.style('title')}>{this.props.title}</span>
    );
  },

  render() {
    let errorMessage = this.t('nTextMaxmumSize') + this.state.maxSize + 'M, ' + this.t('nTextFilesError') + this.state.errorFiles;
    let fileTypes = this.props.fileTypeAccepted;
    if (this.props.acceptVideo) {
      fileTypes = fileTypes.concat(this.props.videoTypeAccepted);
    }

    let {
      dragDropErrorOpen,
      uploadErrorOpen,
      fileTypeErrorOpen,
    } = this.state;

    return (
      <Paper
        style={this.style('root')}
        zDepth={this.props.zDepth}
      >
        {this.renderTitle()}
        <DropZone
          ref="dropzone"
          onDrop={this.onDrop}
          style={this.style('dropzone')}
          view={this.props.view}
          multiple={this.props.multiple}
          disableClick={this.props.disableClick}
        >
          {this.renderFiles()}
          {this.renderUploadBtn()}
        </DropZone>
        <Snackbar
          ref='dragDropError'
          autoHideDuration={5000}
          message={errorMessage}
          open={dragDropErrorOpen}
          style={this.style('snackbar')}
        />
        <Snackbar
          ref='uploadError'
          autoHideDuration={5000}
          message={this.state.uploadError}
          open={uploadErrorOpen}
          style={this.style('snackbar')}
        />
        <Snackbar
          ref='fileTypeError'
          autoHideDuration={5000}
          message={this.t('nTextFileTypeError') + fileTypes.join(', ')}
          open={fileTypeErrorOpen}
          style={this.style('snackbar')}
        />
      </Paper>
    );
  },

  _handleRemoveClick(file) {
    let { onRemoveFiles } = this.props;
    this._removeFile(file);
    if(_.isFunction(onRemoveFiles)){
      onRemoveFiles();
    }
    this.setState({removed:true});
  },

  _handleUploadComplete(file,fileIds) {
    this._handleUploadSuccess(file,fileIds);
  },

  _removeFile(file) {
    let files = this.state.files;
    let newFiles = _.reject(files, (f)=>{
      if(file.id) return file.id === f.id;
      if(file.url) return file.url === f.url;
      return f === file
    });
    this.setState({files: newFiles});
  },

  _onDropFile(files) {
    let filesArr = this.state.files;
    let errorFiles = '';
    let fileTypeError = false;
    let maxSize = this.props.maxFileSize;
    let filterFiles = _.filter(files, (file) => {
      let name = file.name;
      let extension = name.substring(name.lastIndexOf('.') + 1, name.length);
      if (!extension) {
        fileTypeError = true;
        return false;
      }
      if (_.includes(this.props.videoTypeAccepted, extension.toLowerCase())) {
        maxSize = this.props.maxVideoSize;
      }
      if (file.size > maxSize * MAX_SIZE_RATE) {
        errorFiles += file.name + ', ';
      }
      let fileTypes = this.props.fileTypeAccepted;
      if (this.props.acceptVideo) {
        fileTypes = fileTypes.concat(this.props.videoTypeAccepted);
      }
      if (!_.includes(fileTypes, extension.toLowerCase())) {
        fileTypeError = true;
      }
      return file.size <= maxSize * MAX_SIZE_RATE && !fileTypeError;
    });
    filterFiles = _.map(filterFiles, file => {
      return (new FileModel()).initDroppedFile(file);
    });
    filesArr = filesArr.concat(filterFiles);
    if (errorFiles.length > 0) {
      errorFiles = errorFiles.substring(0, errorFiles.length - 2);
    }

    this.setState({
      dragDropErrorOpen: !fileTypeError && errorFiles.length > 0 ? true : false,
      errorFiles: errorFiles,
      fileTypeErrorOpen: fileTypeError ? true : false,
      files: filesArr,
      maxSize: maxSize,
    });
    this._handleFilesChange();
  },

  _handleUploadTouch(e) {
    e.stopPropagation();
    let { onUploadFiles } = this.props;
    if(_.isFunction(onUploadFiles)){
      onUploadFiles();
    }
    this._chooseOneFileToUpload();
  },

  _chooseOneFileToUpload(){
    let files = this.state.files;
    let hasFileToUpload = false;
    for(let i=0, len = files.length; i<len; i++){
      let file = files[i];
      if(file.toUpload){
        file.isUploading = true;
        file.toUpload = false;
        hasFileToUpload = true;
        break;
      }
    }
    if(hasFileToUpload) this.setState({files: files});
  },

  _handleUploadSuccess(file,uploadedFile){
    let files = this.state.files;
    _.forEach(files,f=>{
      if(f === file){
        f.isUploading =false;
        f.uploaded =true;
        f.id = uploadedFile.id;
        f.url = `/files/${uploadedFile.id}`;
      }
    });
    this.setState({
      files:files
    },()=>{
      this._chooseOneFileToUpload();
    });
  },

  _initFiles(files) {
    files = _.uniqBy(files, 'id');
    if (files.length > 0) {
      let loadedFiles = [];
      _.forEach(files, file => {
        let fileModel = (new FileModel()).initLoadedFile(file);
        loadedFiles.push(fileModel);
      });
      this.setState({files: loadedFiles});
    }
  },

  _handleFilesChange() {
    if (this.props.onFilesChange) {
      this.props.onFilesChange();
    }
  },
});

module.exports = DragAndDropFiles;
