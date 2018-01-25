const React = require('react');
const _ = require('eplodash');
const AutoStype = require('epui-auto-style').mixin;
const OrderTypeForm = require('./order-type-form');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;
const PAGE_SIZE = 5;
const PAGE_SORT = {
  'schedule.timePoints.arrival.time': -1,
};

const CreateOrder = React.createClass({
  mixins: [AutoStype, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    ship: PropTypes.object,
    segment: PropTypes.string,
    orders: PropTypes.object,
    user: PropTypes.object,
    createOrderFunc: PropTypes.func,
    voyageSegments: PropTypes.object,
    onCloseDialog: PropTypes.func,
    fromNewVoyage: PropTypes.bool,
    findVoyageSegmentsByShipId: PropTypes.func,
  },

  getDefaultProps() {
    return { };
  },

  getInitialState: function() {
    return {
      creating: null
    };
  },

  componentWillReceiveProps(nextProps) {
    let creating = this.state.creating;
    let loading = this._isLoading(nextProps);
    let error = this._getError(nextProps);

    if(creating && loading && !error) { return; }

    this.setState({
      creating: false
    });
  },

  componentWillMount() {
    this._getVoyageSegements();
  },

  getStyles() {
    return {
      bar: {
        position: 'fixed',
        left: 730,
        bottom: 30,
      },
      button: {
        fontSize: 18,
      }
    };
  },

  clearValue() {
    if(!this.refs.form) { return; }
    this.refs.form.clearValue();
  },

  getValue() {
    let type = this.refs.form.getValue();
    if(!type) { return; }

    let {
      ship,
      segment,
      user,
      fromNewVoyage,
    } = this.props;

    return {
      type: type,
      ship: ship._id,
      segment: segment,
    };
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      segment,
    } = this.props;

    let loading = this._isLoading();
    let valid = this.state.valid;

    return (
      <div style={this.style('root')}>
        <OrderTypeForm
          ref="form"
          disabled={loading}
          onChange={this._handleFormChange}
        />
        <div style={this.style('bar')}>
          <RaisedButton
            key='save'
            label={this.t('nButtonNext')}
            zDepth={0}
            primary={true}
            labelStyle={this.style('button')}
            disabled={loading || !valid}
            onTouchTap={this._handleCreateTouchTap} />
        </div>
      </div>
    );
  },

  _getVoyageSegements() {
    let ship = this.props.ship;
    let id = ship && ship._id;
    let fn = this.props.findVoyageSegmentsByShipId;
    if (_.isFunction(fn)) {
      fn(id, {
        size: PAGE_SIZE,
        sortby: PAGE_SORT,
      });
    }
  },

  _isLoading(props) {
    props = props || this.props;
    if(!props.orders) { return false; }
    return props.orders.getMeta('loading');
  },

  _getError(props) {
    props = props || this.props;
    if(!props.orders) { return false; }
    return props.orders.getMeta('error');
  },

  _handleFormChange(type) {
    this.setState({
      valid: !!type
    });
  },

  _handleCreateTouchTap() {
    let fn = this.props.createOrderFunc;
    let order = this.getValue();
    if (_.isFunction(fn)) {
      fn(order);

      this.setState({
        creating: true,
      });
    }

    let { segment, ship, onCloseDialog } = this.props;
    let pathname = global.location.pathname;
    let redirect = _.split(pathname, '/dashboard')[0] + `/ship/${ship._id}/voyage/${segment}`;
    let globalDialog = global.register.dialog;
    let props = {
      open: false,
      modal: true,
    };
    let alertEle = {
      name: 'Alert',
    };
    if (globalDialog) { globalDialog.generate(props,alertEle); }
    global.tools.toSubPath(redirect, true);
    onCloseDialog();
  },
});

module.exports = CreateOrder;
