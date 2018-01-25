const React = require('react');
const AutoStyle = require('epui/lib/mixins/auto-style');
const Translatable = require('epintl');
const TextField = require('epui/lib/text-field');
const DragDropFiles = require('../../drag-drop-files');
const ORDER_MODE = require('../../constants').ORDER_MODE;

const PropTypes = React.PropTypes;

let PersonList = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epintl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    config: PropTypes.object,
    noteTitleStyle: PropTypes.object,
    feedbackTitleStyle: PropTypes.object,
    product: PropTypes.object,
    nLabelNote:PropTypes.string,
    nLabelFeedBackFiles:PropTypes.string,
    nLabelUploaderFeedBackFiles:PropTypes.string,
    nLabelViewFeedBackFiles:PropTypes.string,
  },

  getDefaultProps() {
    return {
      mode: '',
      order:null,
      productConfig: null,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let noteTitleStyle ={textAlign: 'left'};
    let feedbackTitleStyle={};
    if(this.props.noteTitleStyle){
      _.merge(noteTitleStyle,this.props.noteTitleStyle);
    }
    if(this.props.feedbackTitleStyle){
      _.merge(feedbackTitleStyle,this.props.feedbackTitleStyle);
    }
    return {
      note:{
        marginTop : 40,
      },
      noteTitle:noteTitleStyle,
      textFieldNote:{
        width: '100%',
      },
      feedback:{
        marginTop: 15,
      },
      feedbackTitle:feedbackTitleStyle,
      dropzone:{
        textAlign: 'center',
      },
    };
  },

  getValue(){
    let config ={};
    if(this.refs.note) config.note = this.refs.note.getValue();
    if(this.refs.feedbackFiles) config.feedbackFiles = this.refs.feedbackFiles.getFiles();
    return config;
  },

  isDirty(){
    if(this.props.mode === ORDER_MODE.CONSIGNER) return false;
    return this.refs.feedbackFiles.isDirty();
  },

  renderNote(){
    let config = this.props.config;
    return (
      <div style = {this.style('note')}>
        <TextField
          ref = 'note'
          key= 'note'
          floatingLabelText={this.t('nLabelNote')}
          style= {this.style('textFieldNote')}
          defaultValue = {config.note ? config.note : ''}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  renderFeedbackFiles(){
    let {mode,config} = this.props;
    let filesLen =0;
    let showFeedbackFiles =true;
    if(config.feedbackFiles){
      filesLen = _.isArray(config.feedbackFiles) ? config.feedbackFiles.length: config.feedbackFiles.size;
    }
    if(mode === ORDER_MODE.CONSIGNER && filesLen==0){showFeedbackFiles=false;}
    if(showFeedbackFiles){
      return(
        <DragDropFiles
          key = 'feedbackFiles'
          ref = 'feedbackFiles'
          style = {this.style('feedback')}
          titleStyle = {this.style('feedbackTitle')}
          dropzoneStyle = {this.style('dropzone')}
          title = {mode === ORDER_MODE.CONSIGNER ? this.t('nLabelViewFeedBackFiles'):this.t('nLabelUploaderFeedBackFiles')}
          loadedFiles={config.feedbackFiles ? config.feedbackFiles : []}
          view = {mode === ORDER_MODE.CONSIGNER}
          order ={this.props.order}
          orderEntry ={this.props.orderEntry}
          product = {this.props.product}
          acceptVideo={true}
          productConfig = {this.props.productConfig}
          field ='feedbackFiles'
        />
      );
    }
    return null;
  },

  render() {
    return (
      <div style = {this.style('root')}>
        {this.renderFeedbackFiles()}
        {this.renderNote()}
      </div>
    );
  },

   _handleChange(){
    global.notifyOrderDetailsChange(true);
   },

});
module.exports = PersonList;
