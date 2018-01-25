const React = require('react');
const _ = require('eplodash');
const AddSegmentForm = require('~/src/sections/ship/add-segment-dialog/add-segment-form');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const CreateVoyage = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    createVoyageSegment: PropTypes.func,
    updateVoyageSegmentById: PropTypes.func,
    onTouchTap: PropTypes.func,
    nTitleAddSegment: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextCancel: PropTypes.string,
    nTextSaveAndContinue: PropTypes.string,
    open: PropTypes.bool,
    ship: PropTypes.object,
    voyageSegments: PropTypes.object,
    voyage: PropTypes.object,
    fromNewVoyage: PropTypes.bool,
    segment: PropTypes.string,
  },

  getDefaultProps() {
    return {
      open: false,
    };
  },

  getInitialState: function() {
    return {
      doing: null,
      open: this.props.open,
      showTipsTime: false,
      showTipsNow: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    let doing = this.state.doing;
    let loading = this._isLoading(nextProps);

    if(!doing || loading) { return; }

    if(doing === 'save') {
      this.dismiss();
    } else if(doing === 'saveAndContinue') {
      this.refs.form.clearValue();
    }

    this.setState({
      doing: null
    });
  },

  getStyles() {
    let styles = {
      button:{
        position: 'fixed',
        right: 40,
        bottom: 30,
        zIndex: 2000,
      },
      content:{
        margin: '0px',
      },
      label:{
        color: '#fff',
      },
      title: {
        fontSize: 16,
        color: '#4a4a4a',
        display: 'block',
        margin: '20px 0 15px',
      },
    };

    return styles;
  },

  clearValue() {
    if(!this.refs.form) { return; }
    this.refs.form.clearValue();
  },

  show() {
    this.setState({
      open: true,
    });
  },

  dismiss() {
    this.setState({
      open: false,
      showTipsTime: false,
      showTipsNow: false,
    });
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      voyage,
    } = this.props;

    let {
      showTipsTime,
      showTipsNow,
    } = this.state;

    const showTips = this.state.showTips;

    let loading = this._isLoading();

    return (
      <div>
        <span style={styles.title}>
          {this.t('nTextCreateVoyage')}
        </span>
        <AddSegmentForm
          ref='form'
          disabled={loading}
          ship={ship}
          showTips={showTips}
          contentStyle={styles.content}
          showTipsTime={showTipsTime}
          showTipsNow={showTipsNow}
          newTip={true}
          newVoyage={voyage}
          disableInit={true}
        />
        <div style={styles.button}>
          <FlatButton
            backgroundColor={'#f5a623'}
            key='save'
            labelStyle={styles.label}
            label={this.t('nButtonNext')}
            primary={true}
            disabled={loading}
            onTouchTap={this._handleSaveTouchTap} />
        </div>
      </div>
    );
  },

  _isLoading(props) {
    props = props || this.props;
    if(!props.ship || !props.ship.voyageSegments) { return false; }
    return props.ship.voyageSegments.__loading;
  },

  _getValue() {
    let value = this.refs.form.getValue();
    if (value) {
      value.ship = this.props.ship._id;
    }

    return value;
  },

  _handleCancelTouchTap() {
    this.dismiss();
  },

  _handleSaveTouchTap() {
    let value = this._getValue();
    if (!value) {
      this.setState({
        showTipsTime: false,
        showTipsNow: false,
      });
      return;
    }

    let times = value.schedule.timePoints;
    let timeArr = [];
    times.arrival && times.arrival.time && timeArr.push(Date.parse(times.arrival.time));
    times.berth && times.berth.time && timeArr.push(Date.parse(times.berth.time));
    times.departure && times.departure.time && timeArr.push(Date.parse(times.departure.time));
    let validTime = _.every(timeArr, (item ,index, arr) => {
      return index === arr.length-1 || item < arr[index+1];
    });

    if(!validTime) {
      this.setState({
        showTipsTime: true,
      });
      return;
    }else {
      this.setState({
        showTipsTime: false,
      });
    }

    let validNow = _.every(timeArr, (item ,index, arr) => {
      return item > new Date();
    });

    if(!validNow) {
      this.setState({
        showTipsNow: true,
      });
      return;
    }else {
      this.setState({
        showTipsNow: false,
      });
    }

    let { ship,
          segment,
          voyage,
          fromNewVoyage,
          createVoyageSegment,
          updateVoyageSegmentById } = this.props;
    let response = {};

    if(fromNewVoyage){
      if (_.isFunction(updateVoyageSegmentById)) {
        value.__v = voyage && voyage.__v;
        updateVoyageSegmentById.promise(voyage._id, value, false, voyage.schedule.timePoints).then((res)=>{
          if(res.status === 'OK'){
             response = res.response;
             let resBody = {
               _id: response._id,
               __v: response.__v,
               arrivalPort: response.arrivalPort,
               departurePort: response.departurePort,
               nextPort: response.nextPort,
             };
             this.props.onTouchTap('createOrder','nTextCreateOrder',true, Object.assign({}, value, resBody), voyage._id);
          }
        })
        .catch((err)=>{
          console.log(err);
          console.log(this.t('nTextInitedFailed'));
        })
      }
    }else {
      if (_.isFunction(createVoyageSegment)) {
        createVoyageSegment.promise(value).then((res)=>{
          if(res.status === 'OK'){

             response = res.response;
             let resBody = {
               _id: response._id,
               __v: response.__v,
               arrivalPort: response.arrivalPort,
               departurePort: response.departurePort,
               nextPort: response.nextPort,
             };
             this.props.onTouchTap('createOrder','nTextCreateOrder',true, Object.assign({},value, resBody), response._id);
          }
        })
        .catch((err)=>{
          console.log(err);
          console.log(this.t('nTextInitedFailed'));
        })
      }
    }

    this.setState({
      doing: 'save'
    });
  },

  _handleSaveAndContinueTouchTap() {
    let fn = this.props.createVoyageSegment;
    if (_.isFunction(fn)) {
      fn(this._getValue());
    }

    this.setState({
      doing: 'saveAndContinue'
    });
  }
});

module.exports = CreateVoyage;
