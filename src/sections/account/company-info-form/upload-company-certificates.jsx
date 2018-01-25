const React = require('react');
const _ = require('eplodash');

const TextField = require('epui-md/TextField/TextField');
const Snackbar = require('epui-md/Snackbar');
const DragDropFiles = require('~/src/shared/drag-drop-files');
const Validatable = require('epui-md/HOC/Validatable');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const UploadCompanyCertificates = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
    showRegCert: PropTypes.bool,
    showISOCert: PropTypes.bool,
    showSpecialCert: PropTypes.bool,
    showOtherCert: PropTypes.bool,
    onChange: PropTypes.func,
  },

  getInitialState() {
    return {
      tip: '',
      open: false,
    }
  },

  getDefaultProps(){
    return{
      value:{},
      showRegCert: true,
      showISOCert: true,
      showSpecialCert: true,
      showOtherCert: true,
    };
  },

  getStyles() {
    let styles = {
      root: {
        marginTop: '20px',
      },
      container: {
        marginBottom: '20px',
      },
      header: {
        fontSize: '14px',
        color: 'rgba(0,0,0,0.54)',
        display: 'block',
        marginBottom: '-30px',
      },
      subheader: {
        color: '#f5a623',
      },
      upload: {
        width: '840px',
      },
    };
    return styles;
  },

  getValue(){
    return {
      registrationCert: this.refs.regCert ? this.refs.regCert.getFiles() : [],
      specialCert: this.refs.specialCert ? this.refs.specialCert.getFiles() : [],
      ISOCert: this.refs.ISOCert ? this.refs.ISOCert.getFiles() : [],
      otherCerts: this.refs.otherCerts ? this.refs.otherCerts.getFiles() : [],
    }
  },

  isValid(){
    let valid = true;
    let tip = 'You must upload ';
    let validArray = [
      this.refs.regCert && !this.refs.regCert.isValid(),
      this.refs.specialCert && this.refs.specialCert.isDirty(),
      this.refs.ISOCert && this.refs.ISOCert.isDirty(),
      this.refs.otherCerts && this.refs.otherCerts.isDirty(),
    ];
    let validTips = [
      'Company Registration Certificate',
      'Special Qualification Certificate',
      'Company ISO Certificate',
      'Other Certificates',
    ];
    _.forEach(validArray, (val, index) => {
      if(val) { valid = false, tip = tip + `${validTips[index]}, `};
    });
    if(!valid) { this.setState({tip: tip.substring(0, tip.length - 2), open: true});}
    return new Promise((res, rej) => {
      res(valid);
    });
  },

  isChanged() {
    let changed = false;
    if((this.refs.regCert && this.refs.regCert.isChanged()) || (this.refs.specialCert && this.refs.specialCert.isChanged()) ||
        (this.refs.ISOCert && this.refs.ISOCert.isChanged()) || (this.refs.otherCerts && this.refs.otherCerts.isChanged())){
      changed = true;
    }
    return changed;
  },

  renderRegistrationCert(styles) {
    return this.props.showRegCert ? (
      <div style={styles.container}>
        <span style={styles.header}>{'Upload Company Registration Certificate'}<span style={styles.subheader}>{` (required)`}</span></span>
        <DragDropFiles
          ref='regCert'
          field='regCert'
          style={styles.upload}
          loadedFiles={_.get(this.props.value,'registrationCert',[])}
          view={false}
          acceptVideo={false}
          usage={'registerShip'}
          onChange={this.props.onChange}
        />
      </div>
    ) : null;
  },

  renderSpecialQualificationCert(styles) {
    return this.props.showSpecialCert ? (
      <div style={styles.container}>
        <span style={styles.header}>{'Upload Special Qualification Certificate'}</span>
        <DragDropFiles
          ref='specialCert'
          field='specialCert'
          style={styles.upload}
          loadedFiles={_.get(this.props.value,'specialCert',[])}
          view={false}
          acceptVideo={false}
          usage={'registerShip'}
          onChange={this.props.onChange}
        />
      </div>
    ) : null;
  },

  renderISOCert(styles) {
    return this.props.showISOCert ? (
      <div style={styles.container}>
        <span style={styles.header}>{'Upload Company ISO Certificate'}</span>
        <DragDropFiles
          ref='ISOCert'
          field='ISOCert'
          style={styles.upload}
          loadedFiles={_.get(this.props.value,'ISOCert',[])}
          view={false}
          acceptVideo={false}
          usage={'registerShip'}
          onChange={this.props.onChange}
        />
      </div>
    ) : null;
  },

  renderOtherCerts(styles) {
    return this.props.showOtherCert ? (
      <div style={styles.container}>
        <span style={styles.header}>{'Upload Other Certificates'}</span>
        <DragDropFiles
          ref='otherCerts'
          field='otherCerts'
          style={styles.upload}
          loadedFiles={_.get(this.props.value,'otherCerts',[])}
          view={false}
          acceptVideo={false}
          usage={'registerShip'}
          onChange={this.props.onChange}
        />
      </div>
    ) : null;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style={this.style('root')}>
        {this.renderRegistrationCert(styles)}
        {this.renderSpecialQualificationCert(styles)}
        {this.renderISOCert(styles)}
        {this.renderOtherCerts(styles)}
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

module.exports = UploadCompanyCertificates;
