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

const HomepageEditor = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Homepage/${__LOCALE__}`),
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
    homepageItem : PropTypes.object.isRequired,
  },

  getInitialState() {
    let img = _.get(this.props.homepageItem, ['value', 'img']);
    return {
      partnerDisable: !!img,
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
      value.img = this.refs.banner.getFiles();
      value.link = this.refs.link.getValue() || '';
    }

    if(type === 'partner'){
      value.img = this.refs.partner.getFiles();
      value.name = this.refs.name.getValue() || '';
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

    if(type === 'partner'){
      return Promise.all([
        this.refs.partner.isValid(),
        this.refs.name.isValid(),
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
    let { homepageItem } = this.props;
    let { partnerDisable, bannerDisable } = this.state;
    if(type === 'banner'){
      return (
        <div style={this.style('root')}>
          <DragDropFiles
            ref = 'banner'
            dropzoneStyle={this.style('dropzone')}
            field='banner'
            loadedFiles={_.get(homepageItem, ['value', 'img'], [])}
            view={false}
            acceptVideo = {false}
            multiple={false}
            disableClick={bannerDisable}
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
              defaultValue = {_.get(homepageItem, ['value', 'link'])}
            />
          </div>
        </div>
      )
    }

    if(type === 'partner'){
      return (
        <div style={this.style('root')}>
          <div style={this.style('row')}>
            <TextField
              ref = 'name'
              floatingLabelText={this.t('nLabelPartnerName')}
              fullWidth = {true}
              multiLine={true}
              required={true}
              rows={1}
              defaultValue = {_.get(homepageItem, ['value', 'name'])}
            />
          </div>
          <DragDropFiles
            ref = 'partner'
            dropzoneStyle={this.style('dropzone')}
            field='partner'
            loadedFiles={_.get(homepageItem, ['value', 'img'], [])}
            view={false}
            acceptVideo = {false}
            multiple={false}
            disableClick={partnerDisable}
            usage={'registerShip'}
            onFilesChange={this._handleFilesChange.bind(this,'partnerDisable')}
            onRemoveFiles={this._handleFilesChange.bind(this,'partnerDisable')}
          />
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

module.exports = HomepageEditor;
