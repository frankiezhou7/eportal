const React = require('react');
const _ = require('eplodash');
const AcceptableBerth = require('epui-md/svg-icons/ep/port/AcceptableBerth');
const AutoStyle = require('epui-auto-style').mixin;
const Avatar = require('epui-md/Avatar');
const BerthForm = require('~/src/shared/berth-form');
const Chip = require('epui-md/Chip');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

const Berths = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Berth/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    buttonStyle: PropTypes.object,
    buttonWrapperStyle: PropTypes.object,
    items: PropTypes.array,
    nTextAddBerth: PropTypes.string,
    onShow: PropTypes.func,
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {
      title: 'Berths',
      value: [],
    };
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let val = [];
    let { value } = this.state;
    val = !value ? this.props.items : value;
    return val;
  },

  getStyles() {
    let styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: '4px',
      },
      dialog: {
        width: '990px',
        maxWidth: '990px',
      },
      icon: {
        marginTop: '10px',
        marginRight: '2px',
      },
      buttonStyle: {},
      buttonWrapperStyle: {
        boxSizing: 'border-box',
        margin: '10px',
        width: '100%',
      },
      title: {
        fontSize: '16px',
        lineHeight: '24px',
        pading: '4px 10px',
        width: '100%',
      },
    };

    return styles;
  },

  handleAdd() {
    let { onShow } = this.props;

    if (_.isFunction(onShow)) {
      onShow();
    }
  },

  handleTouchTap(id) {
    let { onShow } = this.props;

    if (_.isFunction(onShow)) {
      onShow(id);
    }
  },

  renderBerths(items, styles) {
    let elements = [];

    if (_.isArray(items)) {
      elements = items.map(item => {
        let { _id, name } = item;

        return (
          <Chip
            key={_id}
            style={styles.chip}
            onTouchTap={this.handleTouchTap.bind(this, _id)}
          >
            <Avatar icon={<AcceptableBerth style={styles.icon} />} />
            {name}
          </Chip>
        );
      });
    }

    return elements;
  },

  render() {
    let {
      buttonStyle,
      buttonWrapperStyle,
      items,
      nTextAddBerth,
    } = this.props;

    let styles = this.getStyles();

    return (
      <div style={this.style('root')}>
        {this.renderBerths(items, styles)}
        <div style={Object.assign(styles.buttonWrapperStyle, buttonWrapperStyle)}>
          <RaisedButton
            label={this.t('nTextAddBerth') || nTextAddBerth}
            primary
            style={Object.assign(styles.buttonStyle, buttonStyle)}
            onTouchTap={this.handleAdd}
          />
        </div>
      </div>
    );
  },
});

module.exports = Berths;
