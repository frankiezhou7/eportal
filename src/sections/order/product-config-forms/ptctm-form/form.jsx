const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const MenuItem = require('epui-md/MenuItem');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
// const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const DateAndTimePicker = require('epui-md/DateAndTimePicker/DateAndTimePicker');
const Translatable = require('epui-intl').mixin;
const moment = require('moment');
const DATE_FORMAT = 'MM-DD-YYYY HH:mm';
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;

const Form = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Address/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes : {
    config: PropTypes.object,
    currencies: PropTypes.object,
    mode: PropTypes.string,
    nLabelAmount: PropTypes.string,
    nLabelTransferTime: PropTypes.string,
    nTextCTMDescription: PropTypes.string,
    nTextCertifications: PropTypes.string,
    nTextDeliveryAmount: PropTypes.string,
    nTextSigningFiles: PropTypes.string,
    nTextUploadCertifications: PropTypes.string,
    nTextUploadSigningFiles: PropTypes.string,
    nTextViewSigningFiles: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      config: '',
      currencies: null,
    };
  },

  getInitialState() {
    let selectedIndex = 0;
    let config = this.props.config;
    if (this.props.currencies && this.props.config) {
      let currencies = this.props.currencies.toJS().entries;
      _.forEach(currencies, (currency, index) => {
        if (currency.code === config.currency) {
          selectedIndex = index;
        }
      });
    }
    return {
      selectedIndex: selectedIndex,
      open: false,
      error: false,
      amount: config.amount ? config.amount : 0,
      noteOneHundred: config.noteOneHundred ? config.noteOneHundred : 0,
      noteFifty: config.noteFifty ? config.noteFifty : 0,
      noteTwenty: config.noteTwenty ? config.noteTwenty : 0,
      noteTen: config.noteTen ? config.noteTen : 0,
      noteFive: config.noteFive ? config.noteFive : 0,
      noteTwo: config.noteTwo ? config.noteTwo : 0,
      noteOne: config.noteOne ? config.noteOne : 0,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let rootStyle = {
      padding: `${padding * 7}px`,
      marginBottom: `${padding * 5}px`,
    };
    if (this.props.style) {
      _.merge(rootStyle, this.props.style);
    }

    let styles = {
      root: rootStyle,
      title: {
        display: 'block',
        marginBottom: `${padding * 3}px`,
        fontSize: '15px',
        fontWeight: '500px',
      },
      subTitle: {
        display: 'block',
        marginBottom: `${padding * 3}px`,
      },
      menu: {
        display: 'inline-block',
        width: '200px',
        verticalAlign: 'bottom',
        textAlign: 'left'
      },
      underlineStyle: {
        margin: '-15px 24px 6px 0px',
      },
      labelStyle: {
        top: '-10px',
        paddingLeft: '0px',
      },
      iconStyle: {
        top: '7px',
      },
      ctmDetail: {
        marginBottom: `${padding * 8}px`,
      },
      amount: {
        display: 'inline-block',
        verticalAlign: 'bottom',
        marginRight: `${padding * 10}px`,
      },
      noteAmount: {
        width: 80,
        display: 'inline-block',
        verticalAlign: 'bottom',
      },
      unit: {
        marginLeft: '5px',
        fontSize: '16px',
        verticalAlign: '10px',
      },
      noteText: {
        marginRight: `${padding * 15}px`,
        display: 'inline-block',
      },
      transferTime: {
        display: 'inline-block',
        verticalAlign: 'bottom',
        marginRight: `${padding * 10}px`,
      },
      inputStyle: {
        paddingBottom: '0px',
      },
      dropzone: {
        textAlign: 'center',
      },
      noteContainer: {
        width: 816,
        margin: '25px auto 0px',
      },
      noteTitle: {

      },
    };

    return styles;
  },

  isDirty() {
    return this.refs.certifications.isDirty() || this.refs.signingFiles.isDirty();
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.refs.certifications.isDirty()) {
      dirtyFiles.push(this.t('nTextCertifications'));
    }
    if (this.refs.signingFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextSigningFiles'));
    }

    return dirtyFiles;
  },

  getValue() {
    let config = this.props.config;
    config.certifications = this.refs.certifications.getFiles();
    config.signingFiles = this.refs.signingFiles.getFiles();
    config.amount = this.amount.getValue();
    config.noteOneHundred = this.noteOneHundred.getValue();
    config.noteFifty = this.noteFifty.getValue();
    config.noteTwenty = this.noteTwenty.getValue();
    config.noteTen = this.noteTen.getValue();
    config.noteFive = this.noteFive.getValue();
    config.noteTwo = this.noteTwo.getValue();
    config.noteOne = this.noteOne.getValue();
    config.currency = this.refs.currency.getValue();
	  config.transferTime = this.refs.transferTime.getValue();

    if(this.note){
      let noteValue = this.note.getValue();
      config.remark = noteValue;
    }

    return config;
  },

  componentWillReceiveProps(nextProps) {
    if (!this.props.currencies && nextProps.currencies) {
      let selectedIndex = this.state.selectedIndex;
      let currencies = nextProps.currencies.toJS().entries;

      _.forEach(currencies, (currency, index) => {
        if (currency.code === config.currency) {
          selectedIndex = index;
        }
      });

      this.setState({selectedIndex: selectedIndex});
    }
  },

  renderCTMDetail() {
    let config = this.props.config;
    let currencies = this.props.currencies.toJS().entries;

    const actions = [
      <FlatButton
        label={this.t('nLabelDialogConfirm')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this._handleDialogClose}
      />,
    ];

    let menuItems = _.reduce(currencies, (items, currency, index) => {
      items.push(
        <MenuItem
          key={index}
          value={currency.code}
          primaryText={currency.name}
        />
      );

      return items;
    }, []);

    let styles = this.getStyles();

    return(
      <div>
        <div style={this.style('ctmDetail')}>
          <span style={this.style('title')}>{this.t('nTextDeliveryAmount')}</span>
          <span style={this.style('subTitle')}>{this.t('nTextCTMDescription')}</span>
          <DropDownMenu
            ref='currency'
            key='currency'
            iconStyle={this.style('iconStyle')}
            labelStyle={this.style('labelStyle')}
            maxHeight={200}
            onChange={this._handleMenuChange}
            style={this.style('menu')}
            underlineStyle={this.style('underlineStyle')}
            value={currencies && currencies[this.state.selectedIndex] && currencies[this.state.selectedIndex].code}
            disabled = {true}
          >
            {menuItems}
          </DropDownMenu>
          <TextField
            ref={(ref) => this.amount = ref}
            key='amount'
            defaultValue={config.amount}
            floatingLabelText={this.t('nLabelAmount')}
            onChange={this._handleNoteAmountChange.bind(this,'amount')}
            style={this.style('amount')}
            onBlur={this._handleDialogOpen.bind(this,'amount')}
          />
          {/*<TextFieldDateTime
            ref='transferTime'
            key='transferTime'
            defaultValue={config.transferTime && moment(config.transferTime, DATE_FORMAT).toDate()}
            floatingLabelText={this.t('nLabelTransferTime')}
            inputStyle={this.style('inputStyle')}
            onKeyPress={this._handleChange}
            style={this.style('transferTime')}
          /> */}
          <DateAndTimePicker
            ref='transferTime'
            mode={'portrait'}
            format={'24hr'}
            locale={'en-US'}
            autoOk={true}
            container={'dialog'}
            value={_.get(config, 'transferTime','')}
            floatingLabelText={this.t('nLabelTransferTime')}
            onChange={this._handleChange}
            style={this.style('transferTime')}
          />
        </div>
        <div style={this.style('ctmDetail')}>
          <span style={this.style('title')}>{this.t('nTextNoteAmount')}</span>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteOneHundred = ref}
              key='noteOneHundred'
              defaultValue={config.noteOneHundred}
              floatingLabelText={'$100'}
              onChange={this._handleNoteAmountChange.bind(this,'noteOneHundred')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteOneHundred')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteFifty = ref}
              key='noteFifty'
              defaultValue={config.noteFifty}
              floatingLabelText={'$50'}
              onChange={this._handleNoteAmountChange.bind(this,'noteFifty')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteFifty')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteTwenty = ref}
              key='noteTwenty'
              defaultValue={config.noteTwenty}
              floatingLabelText={'$20'}
              onChange={this._handleNoteAmountChange.bind(this,'noteTwenty')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteTwenty')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteTen = ref}
              key='noteTen'
              defaultValue={config.noteTen}
              floatingLabelText={'$10'}
              onChange={this._handleNoteAmountChange.bind(this,'noteTen')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteTen')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteFive = ref}
              key='noteFive'
              defaultValue={config.noteFive}
              floatingLabelText={'$5'}
              onChange={this._handleNoteAmountChange.bind(this,'noteFive')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteFive')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteTwo = ref}
              key='noteTwo'
              defaultValue={config.noteTwo}
              floatingLabelText={'$2'}
              onChange={this._handleNoteAmountChange.bind(this,'noteTwo')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteTwo')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
          <div style={this.style('noteText')}>
            <TextField
              ref={(ref) => this.noteOne = ref}
              key='noteOne'
              defaultValue={config.noteOne}
              floatingLabelText={'$1'}
              onChange={this._handleNoteAmountChange.bind(this,'noteOne')}
              style={this.style('noteAmount')}
              onBlur={this._handleDialogOpen.bind(this,'noteOne')}
            />
            <span style={this.style('unit')}>{this.t('nTextNoteUnit')}</span>
          </div>
        </div>
        <Dialog
          title={this.t('nTextTypeErrorTitle')}
          actions={actions}
          modal={false}
          open={this.state.open||this.state.error}
        >
          {this.rendeErrorNotification()}
        </Dialog>
      </div>
    );
  },

  rendeErrorNotification() {
    if(this.state.open) {
      return this.t('nTextTypeError');
    }else if(this.state.error){
      return this.t('nTextPostCodeError');
    }
  },

  renderCertifiFiles() {
    let {
      config,
      mode,
    } = this.props;

    if(config.certifications) {
      return(
        <DragDropFiles
          key='certifications'
          ref='certifications'
          dropzoneStyle={this.style('dropzone')}
          field='certifications'
          loadedFiles={config.certifications}
          order={this.props.order}
          orderEntry={this.props.orderEntry}
          product={this.props.orderEntry.product}
          productConfig={this.props.productConfig}
          title={mode === ORDER_MODE.CONSIGNER ? this.t('nTextViewCertifications'):this.t('nTextUploadCertifications')}
          view={mode === ORDER_MODE.CONSIGNER}
        />
      );
    }

    return null;
  },

  renderSigningFiles() {
    let {
      config,
      mode,
    } = this.props;

    if(config.signingFiles) {
      return(
        <DragDropFiles
          key='signingFiles'
          ref='signingFiles'
          dropzoneStyle={this.style('dropzone')}
          title={mode === ORDER_MODE.CONSIGNER ? this.t('nTextViewSigningFiles'):this.t('nTextUploadSigningFiles')}
          loadedFiles={config.signingFiles}
          order={this.props.order}
          orderEntry={this.props.orderEntry}
          view={mode === ORDER_MODE.CONSIGNER}
          product={this.props.orderEntry.product}
          productConfig={this.props.productConfig}
          field='signingFiles'
        />
      );
    }

    return null;
  },

  renderNote(){
    let { config } = this.props;
    return(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = {(ref) => this.note = ref}
          key = 'note'
          defaultValue = {config && config.remark}
          floatingLabelText={this.t('nLabelNote')}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    if(!this.props.currencies) return null;

    return (
      <div style = {this.style('root')}>
        {this.renderCTMDetail()}
        {this.renderCertifiFiles()}
        {this.renderSigningFiles()}
        {this.renderNote()}
      </div>
    );
   },

  _handleMenuChange(e, index, value) {
    if (!global.isOrderDetailsChanged()) {
      global.notifyOrderDetailsChange(true, () => {
        this.setState({
          selectedIndex: index,
        });
      });
    }
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },

  _handleNoteAmountChange(name) {
    global.notifyOrderDetailsChange(true);
    let value = this[name].getValue();
    if(!_.isInteger(Number(value))) {
      this.setState({error:true});
      this[name].clearValue();
      this.setState({[name]:0});
    }

    if(value.length !== 0) {
      this.setState({[name]:value});
    }else {
      this.setState({[name]:0});
    }
  },

  _handleDialogClose() {
    this.setState({
        open: false,
        error: false,
      });
  },

  _handleDialogOpen(name) {
    global.notifyOrderDetailsChange(true);
    const {
      amount,
      noteOneHundred,
      noteFifty,
      noteTwenty,
      noteTen,
      noteFive,
      noteTwo,
      noteOne
    } = this.state;

    if(parseInt(amount) < 100 * parseInt(noteOneHundred)
                        + 50 * parseInt(noteFifty)
                        + 20 * parseInt(noteTwenty)
                        + 10 * parseInt(noteTen)
                        + 5 * parseInt(noteFive)
                        + 2 * parseInt(noteTwo)
                        + 1 * parseInt(noteOne)){
        this.setState({
          open: true,
          [name]: 0,
        });
        this[name].clearValue();
    }
  },
});

module.exports = Form;
