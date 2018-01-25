const React = require('react');
const _ = require('eplodash');
const AddSegmentForm = require('./add-segment-form');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const AddSegmentDialog = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/SegmentDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    createVoyageSegment: PropTypes.func,
    nTitleAddSegment: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextCancel: PropTypes.string,
    nTextSaveAndContinue: PropTypes.string,
    open: PropTypes.bool,
    ship: PropTypes.object,
    params: PropTypes.object,
    disableInit: PropTypes.bool,
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
    return {
      content: {},
      title: {
        borderBottom: 'none',
      },
      actionsContainer: {
        border:'none',
      }
    };
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
      disableInit
    } = this.props;

    let {
      showTipsTime,
      showTipsNow,
    } = this.state;

    let loading = this._isLoading();

    let actions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        disabled={loading}
        onTouchTap={this._handleCancelTouchTap} />,
      <FlatButton
        key='save'
        label={this.t('nTextSave')}
        primary={true}
        disabled={loading}
        onTouchTap={this._handleSaveTouchTap} />
    ];

    return (
      <Dialog
        ref="dialog"
        title={this.t('nTitleAddSegment')}
        titleStyle={this.style('title')}
        actionsContainerStyle={this.style('actionsContainer')}
        actions={actions}
        contentStyle={styles.content}
        modal={loading}
        open={this.state.open}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        <AddSegmentForm
          ref='form'
          disabled={loading}
          ship={this.props.ship}
          showTipsTime={showTipsTime}
          showTipsNow={showTipsNow}
          disableInit={disableInit}
        />
      </Dialog>
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

    let fn = this.props.createVoyageSegment;
    if(_.isFunction(fn)){
      fn.promise(value)
      .then((res)=>{
        if(res.status === 'OK'){
          let shipId = this.props.params.shipId;
          global.tools.toSubPath(`/ship/${shipId}/voyage/${res.response._id}`, true);
        }
      })
      .catch((err)=>{
        console.log(err);
      })
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

module.exports = AddSegmentDialog;
