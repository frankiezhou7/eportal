const React = require('react');
const _ = require('eplodash');
const Paper = require('epui-md/Paper');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const DragDropFiles = require('~/src/shared/drag-drop-files');
const { FILES_URL } = require('~/src/gateway-urls');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

const NewsConfigEditor = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Homepage/${__LOCALE__}`),
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
    type: PropTypes.string.isRequired,
    newsConfigItem : PropTypes.object.isRequired,
  },

  getInitialState() {
    let img = _.get(this.props.newsConfigItem, ['value', 'img']);
    return {
      bannerDisable: !!img,
    };
  },

  getDefaultProps() {
    return {

    };
  },

  getValue(){
    let { type } = this.props;
    let value = {};
    if(type === 'banner'){
      value.img = this.refs.banner.getFiles() || [];
      value.link = this.refs.link.getValue() || '';
      value.title = this.refs.title.getValue() || '';
    }

    if(type === 'type'){
      value = this.refs.type.getValue() || '';
      // value.code = this.refs.code.getValue() || '';
    }

    return {value};
  },

  isValid() {
    let { type } = this.props;
    if(type === 'banner'){
      return Promise.all([
        this.refs.banner.isValid(),
        // this.refs.link.isValid(),
      ]);
    }

    if(type === 'type'){
      return Promise.all([
        this.refs.type.isValid(),
        // this.refs.code.isValid(),
      ]);
    }
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{

      },
      row: {
        display: 'flex',
      },
      dropzone: {
        textAlign: 'center',
      },
    }
    return styles;
  },

  renderContent(type) {
    let { newsConfigItem } = this.props;
    if(type === 'banner'){
      return (
        <div style={this.style('root')}>
          <DragDropFiles
            ref = 'banner'
            dropzoneStyle={this.style('dropzone')}
            field='banner'
            loadedFiles={_.get(newsConfigItem, ['value', 'img'], [])}
            view={false}
            acceptVideo = {false}
            multiple={false}
            disableClick={this.state.bannerDisable}
            usage={'registerShip'}
            onFilesChange={this._handleFilesChange.bind(this,'bannerDisable')}
            onRemoveFiles={this._handleFilesChange.bind(this,'bannerDisable')}
          />
          <div style={this.style('row')}>
            <TextField
              ref = 'link'
              floatingLabelText={this.t('nLabelLink')}
              fullWidth = {true}
              multiLine={true}
              rows={1}
              required={true}
              url
              defaultValue = {_.get(newsConfigItem, ['value', 'link'])}
            />
          </div>
          <div style={this.style('row')}>
            <TextField
              ref = 'title'
              floatingLabelText={this.t('nLabelTitle')}
              fullWidth = {true}
              multiLine={true}
              rows={1}
              required={false}
              defaultValue = {_.get(newsConfigItem, ['value', 'title'])}
            />
          </div>
        </div>
      )
    }

    if(type === 'type'){
      return (
        <div style={this.style('root')}>
          <div style={this.style('row')}>
            <TextField
              ref = 'type'
              floatingLabelText={this.t('nLabelTypeName')}
              fullWidth = {true}
              multiLine={true}
              required={true}
              rows={1}
              defaultValue = {_.get(newsConfigItem, 'value')}
            />
          </div>
          {/*<div style={this.style('row')}>
            <TextField
              ref = 'code'
              floatingLabelText={this.t('nLabelTypeCode')}
              fullWidth = {true}
              multiLine={true}
              required={true}
              rows={1}
              defaultValue = {_.get(newsConfigItem, ['value', 'code'])}
            />
          </div>*/}
        </div>
      )
    }
  },

  render() {
    let { type } = this.props;
    return (
      <div style = {this.style('root')}>
        {this.renderContent(type)}
      </div>
    );
  },

  _handleFilesChange(name){
    this.setState({
      [name]: !this.state[name],
    });
  },
});

module.exports = NewsConfigEditor;
