const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const DragDropFiles = require('~/src/shared/drag-drop-files');
const TextFieldShipName = require('~/src/shared/text-field-ship-name');
const TextFieldImo = require('~/src/shared/text-field-imo');

const PropTypes = React.PropTypes;

const UploadShipParticular = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {

    };
  },

  getValue(){
    return {
      name: this.refs.shipName.getValue(),
      imo: this.refs.shipImo.getValue(),
      shipParticular: this.refs.shipParticular.getFiles(),
    }
  },

  getComponent(){
    return this.refs.shipParticular;
  },

  getStyles() {
    let styles = {
      root: {},
      title: {
        fontSize: 16,
        color: '#4a4a4a',
        display: 'block',
        marginTop: 25,
        marginBottom: 10,
      },
      textContainer: {
        marginBottom: 90,
      },
      textfield:{
        marginRight: 20,
        float: 'left',
      },
      dropzone: {
        textAlign: 'center',
      },
    };

    return styles;
  },

  render() {
    let {
      value
    } = this.props;

    return (
      <div>
        <span style={this.style('title')}>
          {this.t('nTextUploadShipParticular')}
        </span>
        <div style={this.style('textContainer')}>
          <TextFieldImo
            ref='shipImo'
            style={this.style('textfield')}
            value={value && value.imo}
            disabled={true}
          />
          <TextFieldShipName
            ref='shipName'
            style={this.style('textfield')}
            value={value && value.name}
          />
        </div>
        <DragDropFiles
          dropzoneStyle={this.style('dropzone')}
          ref='shipParticular'
          field='shipParticular'
          loadedFiles={value ? value.shipParticular : []}
          view={false}
          acceptVideo = {false}
          usage={'registerShip'}
        />
      </div>
    );
  },
});

module.exports = UploadShipParticular;
