const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Colors = require('epui-md/styles/colors');
const PropTypes = React.PropTypes;

const SegmentTime = React.createClass({

  mixins: [AutoStyle],

  propTypes: {
    style: PropTypes.object,
    title: PropTypes.string,
    date: PropTypes.string,
    time:  PropTypes.string,
    sub: PropTypes.string,
    titleStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    status: PropTypes.number,
    isEmphasize: PropTypes.bool,
    isEstimate: PropTypes.bool,
    arrivalUpdate: PropTypes.bool,
    berthUpdate: PropTypes.bool,
    departureUpdate: PropTypes.bool,
    type: PropTypes.string,
  },

  contextTypes: {
    muiTheme: PropTypes.object
  },

  getDefaultProps() {
    return {
      title: '',
      content: '',
      isEmphasize: false,
      isEstimate: false,
    };
  },

  getInitialState() {
    return {

    };
  },

  getTheme() {
    return this.context.muiTheme.statusBar;
  },

  getStyles() {
    let style = this.props.style;
    let theme = this.getTheme();

    let styles = {
      root: _.merge({
        display: 'inline-block',
        padding: '15px 15px',
        width: '150px',
        height: '62px',
        verticalAlign: 'middle'
      }, style),
      top: {
        margin: 0,
        color: theme.titleColor,
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: '500',
      },
      middle: {
        margin: 0,
        color: this.props.isEstimate ? theme.textEstArrivalColor : theme.textArrivalColor,
        textAlign: 'left',
        fontSize: '18px',
        verticalAlign: 'bottom',
        fontWeight: '700',
      },
      bottom: {
        margin: 0,
        textAlign: 'left',
        fontSize: '12px'
      },
      date: {
        // fontWeight: 'bold'
      },
      time: {
        paddingLeft: '8px',
        fontSize: '80%'
      },
      timeUpdated: {
        color: '#e44d3c',
        paddingLeft: '8px',
        fontSize: '80%'
      },
      dateUpdated: {
        color: '#e44d3c',
      },
    };

    return styles;
  },

  render() {
    let {
      style,
      title,
      date,
      time,
      sub,
      titleStyle,
      contentStyle,
      arrivalUpdate,
      berthUpdate,
      departureUpdate,
      type
    } = this.props;

    let isUpdate = false;
    if(type === 'arrival'){
      isUpdate = arrivalUpdate;
    }else if(type === 'berth'){
      isUpdate = berthUpdate;
    }else if(type === 'departure'){
      isUpdate = departureUpdate;
    }

    let topElement = (
      <p style={this.style('top')}>
        {title}
      </p>
    );

    let timeElement = time ? (
      <span style={isUpdate ? this.style('timeUpdated') : this.style('time')}>{time}</span>
    ) : null;

    let contentElement = (
      <p style={this.style('middle')}>
        <span style={isUpdate ? this.style('dateUpdated') : this.style('date')}>{date}</span>
        {timeElement}
      </p>
    );

    let subElement = sub ? (
      <p style={this.style('bottom')}>
        {sub}
      </p>
    ) : null;

    return (
      <div style={this.style('root')}>
        {topElement}
        {contentElement}
        {subElement}
      </div>
    );
  }

});

module.exports = SegmentTime;
