const React = require('react');
const _ = require('eplodash');

const TextField = require('epui-md/TextField/TextField');
const DragDropFiles = require('~/src/shared/drag-drop-files');
const Snackbar = require('epui-md/Snackbar');
const Validatable = require('epui-md/HOC/Validatable');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const UploadCompanyProfile = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.array,
    onChange: PropTypes.func,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getInitialState() {
    return {
      tip: '',
      open: false,
    }
  },

  getDefaultProps(){
    return{

    };
  },

  getStyles() {
    let styles = {
      root: {
        marginTop: '20px',
      },
      header: {
        fontSize: '14px',
        color: 'rgba(0,0,0,0.54)',
        display: 'block',
        marginBottom: '-30px',
      },
      upload: {
        width: '840px',
      },
    };
    return styles;
  },

  getValue(){
    return !this.refs.companyProfile.isDirty() ? this.refs.companyProfile.getFiles() : [];
  },

  isValid(){
    let valid = true;
    let tip = 'You must upload Company Profile';
    if(this.refs.companyProfile.isDirty()){
      valid = false;
      this.setState({tip, open: true});
    }
    return new Promise((res, rej) => {
      res(valid);
    });
  },

  isChanged(){
    return this.refs.companyProfile.isChanged();
  },

  renderUploadComponent(styles) {
    let { value } = this.props;
    return (
      <div>
        <span style={styles.header}>{'Upload Company Profile'}</span>
        <DragDropFiles
          ref='companyProfile'
          field='companyProfile'
          style={styles.upload}
          loadedFiles={_.isArray(value) && value}
          view={false}
          acceptVideo={false}
          usage={'registerShip'}
          onChange={this.props.onChange}
        />
      </div>
    )
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style={this.style('root')}>
        {this.renderUploadComponent(styles)}
        <Snackbar
          open={this.state.open}
          message={this.state.tip}
          autoHideDuration={5000}
          onRequestClose={this._handleRequestClose}
        />
      </div>
    );
  },

  _handleRequestClose(timeout) {
    if(timeout === 'timeout')
    this.setState({
      open:false,
      tip: null
    });
  },
});

module.exports = UploadCompanyProfile;
