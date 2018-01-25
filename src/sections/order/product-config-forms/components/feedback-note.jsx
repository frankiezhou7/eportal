const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DragDropFiles = require('../../drag-drop-files');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;

const FeedBackNote = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    config: PropTypes.object,
    feedbackTitleStyle: PropTypes.object,
    mode: PropTypes.string,
    nLabelFeedBackFiles: PropTypes.string,
    nLabelNote: PropTypes.string,
    nLabelUploaderFeedBackFiles: PropTypes.string,
    nLabelViewFeedBackFiles: PropTypes.string,
    noteTitleStyle: PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    product: PropTypes.object,
    productConfig: PropTypes.object,
    acceptVideo: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      mode: '',
      order: null,
      productConfig: null,
      acceptVideo: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let noteTitleStyle = {
      textAlign: 'left'
    };
    let feedbackTitleStyle = {};
    if (this.props.noteTitleStyle) {
      _.merge(noteTitleStyle, this.props.noteTitleStyle);
    }
    if (this.props.feedbackTitleStyle) {
      _.merge(feedbackTitleStyle, this.props.feedbackTitleStyle);
    }

    let styles = {
      note: {

      },
      noteTitle: noteTitleStyle,
      textFieldNote: {
        width: '100%',
      },
      feedback: {
        marginTop: 15,
      },
      feedbackTitle: feedbackTitleStyle,
      dropzone: {
        textAlign: 'center',
      },
    };

    return styles;
  },

  getValue() {
    let config = {};
    if (this.refs.note) {
      config.note = this.refs.note.getValue();
    }
    if (this.refs.feedbackFiles) {
      config.feedbackFiles = this.refs.feedbackFiles.getFiles();
    }else{
      config.feedbackFiles =[];
    }
    return config;
  },

  isDirty() {
    if (this.props.mode === ORDER_MODE.CONSIGNER) {
      return false;
    }

    return this.refs.feedbackFiles.isDirty();
  },

  renderNote(){
    let config = this.props.config;
    return (
      <div style={this.style('note')}>
        <TextField
          ref='note'
          key='note'
          id='note'
          floatingLabelText={this.t('nLabelNote')}
          defaultValue={_.get(config,'note','')}
          onChange={this._handleChange}
          style={this.style('textFieldNote')}
        />
      </div>
    );
  },

  renderFeedbackFiles() {
    let {
      config,
      mode,
    } = this.props;
    let showFeedbackFiles = true;
    // let filesLen = 0;
    // if (config.feedbackFiles) {
    //   filesLen = _.isArray(config.feedbackFiles) ? config.feedbackFiles.length : config.feedbackFiles.size;
    // }
    // if (mode === ORDER_MODE.CONSIGNER) {
    //   showFeedbackFiles = false;
    // }
    if(showFeedbackFiles) {
      return(
        <DragDropFiles
          key='feedbackFiles'
          ref='feedbackFiles'
          dropzoneStyle={this.style('dropzone')}
          field='feedbackFiles'
          loadedFiles={_.get(config,'feedbackFiles',[])}
          order={this.props.order}
          orderEntry={this.props.orderEntry}
          product={this.props.product}
          productConfig={this.props.productConfig}
          style={this.style('feedback')}
          title={mode === ORDER_MODE.CONSIGNER ? this.t('nLabelViewFeedBackFiles'):this.t('nLabelUploaderFeedBackFiles')}
          titleStyle={this.style('feedbackTitle')}
          view={mode === ORDER_MODE.CONSIGNER}
          acceptVideo = {this.props.acceptVideo}
        />
      );
    }

    return null;
  },

  render() {
    return (
      <div style={this.style('root')}>
        {this.renderFeedbackFiles()}
        {this.renderNote()}
      </div>
    );
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = FeedBackNote;
