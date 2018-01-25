const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DialogTextBox = require('epui-md/ep/DialogTextBox');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const MAX_INPUT_LENGTH = 2000;
const IconAdd = require('epui-md/svg-icons/content/add');
const FlatButton = require('epui-md/FlatButton');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const Dialog = require('epui-md/Dialog');
const TextField = require('epui-md/TextField');
import TextFieldDateTime from 'epui-md/TextField/TextFieldDateTime';

const OrderEntryEventsHeader = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/OrderEntryEvents/${__LOCALE__}`),

  propTypes: {
    loading: PropTypes.bool,
    style: PropTypes.object,
    onTouchTap: PropTypes.func,
    nErrorTextDateTime: PropTypes.string,
    nTextReport: PropTypes.string,
    nTextReportLatestEvent: PropTypes.string,
    nTextUpdateReport: PropTypes.string,
  },

  getDefaultProps() {
    return {
      loading: false,
    };
  },

  getInitialState() {
    return {
      open: false,
      textView: '',
      time:'',
    };
  },

  getStyles() {
    let { style } = this.props;
    let styles = {
      root: {},
      updateButton: {
        textAlign: 'center',
        width: '100%',
        height: '16px',
        color: '#F5A623',
        cursor:'pointer',
        margin:'20px auto 0 auto',
      },
      iconAdd: {
        width: '16px',
        height: '16px',
        marginRight: '13px',
        background: '#F5A623',
        fill: '#FFF',
        borderRadius: '50%',
      },
      span:{
        height: '16px',
        fontSize: '16px',
        lineHeight: '16px',
        color: '#F5A623',
        display:'inline-block',
        position: 'relative',
        top: '-3px',
        userSelect: 'none',
      },
    };

    styles.root = _.merge(styles.root, style);

    return styles;
  },
  _renderDialogContent() {
    let {
      loading,
      nErrorTextDateTime,
    } = this.state;
    return(
      <DialogTextBox
        ref="dialogTextBox"
        disabled={loading}
        label={this.t('nTextReport')}
        placeholder={this.t('nTextWriteReport')}
        style={this.style('root')}
        disableLength={true}
        keepOpen={true}
        showDate={true}
      />
    )
  },
  renderAddDialog() {
    let actions = [
      <FlatButton
        key="back"
        label={this.t('nButtonCancel')}
        primary={true}
        onTouchTap={this._handleCloseDialog}
      />,
      <FlatButton
        key="save"
        label={this.t('nTextSave')}
        onTouchTap={this._handleTouchTap}
      />
    ];

    return (
      <Dialog
        ref='updateReportDialog'
        open={this.state.open}
        title={this.t('nTextUpdateReport')}
        actions={actions}
      >
        {this._renderDialogContent()}
      </Dialog>
    );
  },

  render() {
    let {
      loading,
      nErrorTextDateTime,
    } = this.state;

    return (
      <div>
        <div style={this.style('updateButton')}>
          <div
            onTouchTap={this._handleAddTouch}
            >
            <IconAdd
              style={this.style('iconAdd')}
            />
            <span
              style={this.style('span')}
            >
              {this.t('nTextUpdateReport')}
            </span>
          </div>

        </div>
        {this.renderAddDialog()}

      </div>
    );
  },

  _handleTouchTap() {
    let value = this.refs.dialogTextBox.getValue();
    if(!value) return;
    let date = value && value.date;
    let nErrorTextDateTime = date ? '' : this.t('nErrorTextDateTime');

    this.setState({
      open: false,
      nErrorTextDateTime: nErrorTextDateTime,
    });

    if (!date) { return; }

    let fn = this.props.onTouchTap;
    if (_.isFunction(fn)) { fn(value); };
  },

  _handleAddTouch() {
    this.setState({
      open: true,
    })
  },
  _handleCloseDialog() {
    this.setState({
      open: false,
    })
  },
  // _handleSaveDialog() {
  //   this.setState({
  //     open: false,
  //   })
  // }
});

module.exports = OrderEntryEventsHeader;
