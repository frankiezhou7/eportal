const React = require('react');
const _ = require('eplodash');
const Paper = require('epui-md/Paper');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const RichEditor = require('epui-rich-editor');
const OrganizationPorts = require('~/src/shared/organization-ports');
const DatePicker = require('epui-md/DateAndTimePicker/DatePicker');
const { FILES_URL } = require('~/src/gateway-urls');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);
const TextFieldDescription = require('~/src/shared/text-field-description');

const RegulationEditor = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
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
    regulationItem : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      regulationItem:{

      },
    };
  },

  isValid(){
    return Promise.all([
      this.refs.title.isValid(),
      this.refs.summary.isValid(),
      this.refs.from.isValid(),
    ]);
  },

  getValue(){
    let regulation = this.props.regulationItem;
    regulation.title = this.refs.title.getValue();
    regulation.summary = this.refs.summary.getValue();
    let keypoint = this.refs.keypoint.getValue();
    // keypoint = keypoint.split(' ');
    regulation.keypoint = keypoint;
    regulation.chinese = this.refs.chineseEditor.html();
    regulation.chineseEditor = this.refs.chineseEditor.getValue();
    regulation.english = this.refs.englishEditor.html();
    regulation.englishEditor = this.refs.englishEditor.getValue();
    regulation.ports = this.refs.ports.getValue();
    regulation.date = this.refs.date.getDate();
    regulation.from = this.refs.from.getValue();

    return regulation;
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{

      },
      textField:{
        marginTop: 10,
        width: '100%',
      },
      date: {
        marginTop: -25,
      },
      ports: {
        margin: '20px 0px'
      },
      editor:{
        width: '100%',
        marginTop: 10,
        boxShadow: 'none',
      },
      label: {
        display: 'block',
        margin: '20px 0px 15px',
      },
      row: {
        display: 'flex',
      },
      from: {
        width: 256,
        marginRight: 20,
      },
    }
    return styles;
  },

  render() {
    const regulationItem = this.props.regulationItem;
    const chineseValue = regulationItem.chineseEditor;
    const englishValue = regulationItem.englishEditor;
    const uploadPromise = global.api.epds && global.api.epds.storeNewsFile ? global.api.epds.storeNewsFile.promise : null;
    if(chineseValue && !chineseValue.entityMap) { chineseValue.entityMap = {} };
    if(englishValue && !englishValue.entityMap) { englishValue.entityMap = {} };
    let keypoint = _.get(regulationItem, 'keypoint');
    if(_.isArray(keypoint)) { keypoint = keypoint.join(' '); }
    return (
      <div style = {this.style('root')}>
        <TextField
          style = {this.style('textField')}
          ref = 'title'
          hintText = 'Regulation Title'
          fullWidth = {true}
          required = {true}
          defaultValue = {regulationItem && regulationItem.title}
        />
        <TextFieldDescription
          style = {this.style('textField')}
          ref = 'summary'
          hintText = 'Regulation Summary'
          fullWidth = {true}
          required = {true}
          defaultValue = {regulationItem && regulationItem.summary}
        />
        <TextField
          style = {this.style('textField')}
          ref = 'keypoint'
          hintText = 'Keypoint'
          fullWidth = {true}
          multiLine={true}
          rows={1}
          defaultValue = {keypoint}
        />
        <OrganizationPorts
          ref='ports'
          style={this.style('ports')}
          value={regulationItem && regulationItem.ports}
          label='Applicable Ports'
          showAll={true}
        />
        <div style={this.style('row')}>
          <TextField
            style = {this.style('from')}
            ref = 'from'
            hintText = 'From'
            fullWidth = {true}
            multiLine={true}
            required = {true}
            rows={1}
            defaultValue = {regulationItem && regulationItem.from}
          />
          <DatePicker
            ref='date'
            mode={'portrait'}
            defaultDate={regulationItem && regulationItem.date}
            locale={'en-US'}
            container={'dialog'}
            autoOk={true}
            floatingLabelText='Effective Date'
            textFieldStyle={this.style('date')}
          />
        </div>
        <span style={this.style('label')}>英文版法规</span>
        <RichEditor
          style = {this.style('editor')}
          ref = 'englishEditor'
          upload = {uploadPromise}
          defaultValue = {englishValue}
        />
        <span style={this.style('label')}>中文版法规</span>
        <RichEditor
          style = {this.style('editor')}
          ref = 'chineseEditor'
          upload = {uploadPromise}
          defaultValue = {chineseValue}
        />
      </div>
    );
  }

});

module.exports = RegulationEditor;
