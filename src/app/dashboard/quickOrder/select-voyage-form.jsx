const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const SegmentList = require('~/src/sections/ship/segment-list/segment-list');

const PropTypes = React.PropTypes;
const PAGE_SIZE = 5;
const PAGE_SORT = {
  'schedule.timePoints.arrival.time': -1,
};

const SelectVoyage = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    findVoyageSegmentsByShipId: PropTypes.func,
    ship: PropTypes.object,
    voyageSegments: PropTypes.object,
    onItemTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {

    };
  },

  componentWillMount(){

  },

  getStyles() {
    let styles = {
      root: {},
      list: {
        width: '100%',
        height: '265px',
        overflowY: 'auto',
        overflowX: 'hidden'
      },
      hint:{
        display: 'block',
        fontSize: 14,
        marginBottom: 20,
      },
      title: {
        fontSize: 16,
        color: '#4a4a4a',
        display: 'block',
        marginTop: 20,
        marginBottom: 25,
      },
    };

    return styles;
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

  renderShipEntry(entry) {
    return (
      <div>

      </div>
    )
  },

  render() {
    let {
      ship,
      voyageSegments,
      onItemTouchTap,
      ...others
    } = this.props;

    return (
      <div>
        <span style={this.style('title')}>
          {this.t('nTextSelectVoyage')}
        </span>
        <span style={this.style('hint')}>
          {this.t('nHintSelectVoyageBelow')}
        </span>
        <SegmentList
          voyageSegments={voyageSegments}
          canAddSegment={false}
          open={true}
          openWidth={760}
          onItemTouchTap={onItemTouchTap}
          unselectDefault={true}
          ship={ship}
          zDepth={1}
          style={this.style('list')}
          hideCancellation={true}
          {...others}
          />
      </div>
    );
  },
});

module.exports = SelectVoyage;
