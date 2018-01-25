const Checkbox = require('epui-md/Checkbox');
const DropDownMenu = require('epui-md/DropDownMenu/DropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const RadioButton = require('epui-md/RadioButton/RadioButton');
const RadioButtonGroup = require('epui-md/RadioButton/RadioButtonGroup');
const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
// const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const DateAndTimePicker = require('epui-md/DateAndTimePicker/DateAndTimePicker');
const Translatable = require('epui-intl').mixin;
const moment = require('moment');
const DATE_FORMAT = 'MM/DD/YYYY HH:mm';

const SegmentTimeEdit = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/SegmentStatus/${__LOCALE__}`),

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    title: React.PropTypes.string.isRequired,
    tips: React.PropTypes.string,
    label: React.PropTypes.string,
    defaultValue: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    primaryText: React.PropTypes.string,
    nLabelBerthTime: React.PropTypes.string,
    nLabelDepartureTime: React.PropTypes.string,
  },

  getInitialState() {
    let def = this.props.defaultValue;

    let time = def && def.time && new Date(def.time);
    let period = def && def.period;
    let est = def && def.estimated;

    return {
      time: time,
      period: period || 'fullday',
      isEstimated: !_.isBoolean(est) ? true : est,
      dateText: null,
      errorText: null,
    };
  },

  setValue(val) {
    this.setState({
      time: val.time || null,
      period: val.period || 'fullday',
      isEstimated: val.isEstimated || true,
    });
    // this.refs.date.setValue(val.time);
  },

  getValue() {
    // let date = this.refs.date.getValue();

    let isEst = this.state.isEstimated;
    let period = null;

    let obj = {
      time: this.refs.date.getValue(),
      estimated: isEst
    };

    if(isEst) {
      obj.period = this.state.period;
    }

    return obj;
  },

  getStyles() {
    let theme = this.context.muiTheme;

    return {
      root: {
        width: '163px',
        display: 'inline-block',
        marginRight: '20px',
      },
      textfield: {
        height: '102px',
        paddingTop: '0',
        paddingBottom: '0',
      },
      textfieldWrapper: {
        width: '100%',
        height: '46px',
        display: 'block',
      },
      radioButtonGroup: {
        marginTop: '16px',
        height: '18px',
        fontSize: '13px',
      },
      radioButton: {
        width: '86px',
        display: 'inline-block'
      },
      dropDownMenuWrapper: {
        display: 'block',
        position: 'relative',
      },
      tips:{
        color: theme.epColor.orangeColor,
        position: 'absolute',
        left: '110px',
        fontSize: '14px',
        bottom: '-2px',
      },
      dropDownMenu: {
        root: {
          paddingLeft:'2px',
          display: 'block',
          height: '36px',
          width: '110px',
        },
        label: {
          paddingLeft: 0,
        },
        underline: {
          display: 'none',
        },
      },
      labelStyle: {
        color: theme.epColor.orangeColor,
        display: 'block',
        fontSize: '14px',
        lineHeight: '14px',
      },
      textFieldStyle: {
        width: '163px',
      }
    };
  },

  render() {
    let {
      title,
      label,
      disabled,
      errorText,
      primaryText,
      tips,
      ...rest,
    } = this.props;

    let {
      time,
      period,
      isEstimated,
      dateText,
    } = this.state;

    if(time && !dateText) {
      dateText = this.toShortDate(time);
    }

    let display = `AT${primaryText}`;
    if(primaryText == 'B') display = this.t('nLabelBerthTime');
    if(primaryText == 'D') display = this.t('nLabelDepartureTime');


    return (
      <div style={this.style('root')}>
        <div style={this.style('dropDownMenuWrapper')}>
          <DropDownMenu
            style={this.style('dropDownMenu.root')}
            labelStyle={this.style('dropDownMenu.label')}
            underlineStyle={this.style('dropDownMenu.underline')}
            value={isEstimated}
            disabled={disabled}
            onChange={this._handleCheck}
          >
            <MenuItem value={true} primaryText={`ET${primaryText}`} />
            <MenuItem value={false} primaryText={display} />
          </DropDownMenu>
          <span style={this.style('tips')}>{tips}</span>
        </div>
        <div style={this.style('textfieldWrapper')}>
          {/* <TextFieldDateTime
            ref='date'
            defaultValue={time}
            floatingLabelText={title}
            errorText={errorText}
            showYear={true}
            fullWidth={true}
            nTextInvalidDate={this.t('nTextInvalidDate')}
            onBlur={this._handleDateBlur}
            disabled={disabled}
            // infoText={dateText}
          /> */}

          <DateAndTimePicker
            ref='date'
            mode={'portrait'}
            format={'24hr'}
            value={time}
            locale={'en-US'}
            autoOk={true}
            container={'dialog'}
            floatingLabelText={title}
            disabled={disabled}
            textFieldStyle= {this.style('textFieldStyle')}
          />

        </div>
        {/* <RadioButtonGroup
          ref='periodArrival'
          name='periodArrival'
          style={this.style('radioButtonGroup')}
          onChange={this._handlePeriodChange}
          defaultSelected={period}
        >
          <RadioButton
            style={this.style('radioButton')}
            disabled={disabled || !isEstimated}
            value='am'
            label={this.t('nLabelVoyageTimePeriodAM')} />
          <RadioButton
            style={this.style('radioButton')}
            disabled={disabled || !isEstimated}
            value='pm'
            label={this.t('nLabelVoyageTimePeriodPM')} />
        </RadioButtonGroup> */}
      </div>
    );
  },

  _handleCheck(e, index, checked) {
    this.setState({
      isEstimated: checked,
    });
  },

  _handleDateBlur(e) {
    if(!e.target.value) { return; }
    this.setState({
      dateText: this.toShortDate(e.target.value)
    });
  },

  _handlePeriodChange(e, newPeriod) {
    this.setState({ period: newPeriod });
  },
});

module.exports = SegmentTimeEdit;
