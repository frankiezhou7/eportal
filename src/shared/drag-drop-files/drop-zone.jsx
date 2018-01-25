const React = require('react');
const ReactDOM = require('react-dom');
const AutoStyle = require('epui-auto-style').mixin;
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const accept = require('attr-accept');

const Dropzone = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onDrop: PropTypes.func,
    onDropAccepted: PropTypes.func,
    onDropRejected: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    style: PropTypes.object,
    disableClick: PropTypes.bool,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    zDepth:PropTypes.number,
    children:PropTypes.node,
    view: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disableClick: false,
      multiple: true,
      zDepth: 0,
    };
  },

  getInitialState() {
    return {
      isDragActive: false,
    };
  },

  getStyles() {
    let theme = this.state.muiTheme;
    let rootStyle = {
      width: '100%',
      minHeight: 200,
      opacity : this.state.isDragActive ? 0.5 : 1,
      textAlign: 'center',
    };
    if (this.props.style) {
      _.merge(rootStyle, this.props.style);
    }
    let styles = {
      root: rootStyle,
    };

    return styles;
  },

  componentDidMount() {
    this.enterCounter = 0;
  },

  allFilesAccepted(files) {
    return files.every(file => accept(file, this.props.accept));
  },

  onDragEnter(e) {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;

    // This is tricky. During the drag even the dataTransfer.files is null
    // But Chrome implements some drag store, which is accesible via dataTransfer.items
    let dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];

    // Now we need to convert the DataTransferList to Array
    let itemsArray = Array.prototype.slice.call(dataTransferItems);
    let allFilesAccepted = this.allFilesAccepted(itemsArray);

    this.setState({
      isDragActive: allFilesAccepted,
      isDragReject: !allFilesAccepted
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter(e);
    }
  },

  onDragOver (e) {
    e.preventDefault();
  },

  onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({
      isDragActive: false,
      isDragReject: false
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave(e);
    }
  },

  onDrop(e) {
    if(this.props.view === true) return;
    e.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0;

    this.setState({
      isDragActive: false,
      isDragReject: false,
    });

    let droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    let max = this.props.multiple ? droppedFiles.length : 1;
    let files = [];

    for (let i = 0; i < max; i++) {
      let file = droppedFiles[i];
      file.preview = URL.createObjectURL(file);
      files.push(file);
    }

    if (this.props.onDrop) {
      this.props.onDrop(files, e);
    }

    if (this.allFilesAccepted(files)) {
      if (this.props.onDropAccepted) {
        this.props.onDropAccepted(files, e);
      }
    } else {
      if (this.props.onDropRejected) {
        this.props.onDropRejected(files, e);
      }
    }
  },

  onClick(e) {
    if (!this.props.disableClick) {
      this.open();
    }
  },

  open() {
    if(!this.props.view) {
      let fileInput = this.refs.fileInput;
      fileInput.value = null;
      fileInput.click();
    }
  },

  render() {
    return (
      <Paper
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        style={this.style('root')}
        transitionEnabled={false}
        zDepth={this.props.zDepth}
      >
        {this.props.children}
        <input
          type='file'
          ref='fileInput'
          accept={this.props.accept}
          multiple={this.props.multiple}
          onChange={this.onDrop}
          style={{ display: 'none' }}
        />
      </Paper>
    );
  },
});

module.exports = Dropzone;
