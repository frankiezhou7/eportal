const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Card = require('epui-md/Card/Card');
const CardText = require('epui-md/Card/CardText');
const CardNotifications = require('./card-notifications');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const IconStar = require('epui-md/svg-icons/toggle/star');

const DashboardCard = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    action: PropTypes.string,
    maxDWT: PropTypes.string,
    onTouchTap: PropTypes.func,
    orderType: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    portName: PropTypes.string,
    shipId: PropTypes.string,
    shipName: PropTypes.string,
    shipType: PropTypes.string,
    timePoint: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    isFavorite: PropTypes.bool,
    isFinished: PropTypes.bool,
    read: PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      hover: false,
    };
  },

  getTheme() {
    return this.context.muiTheme;
  },

  getStyles() {
    let { style ,timePoint ,isFinished, isFavorite } = this.props;
    let epColor = this.getTheme().epColor;
    let statusColor = epColor.primaryColor;
    if(timePoint && timePoint.type === 'ATA') statusColor = '#ffa000';
    if(isFinished) statusColor = '#9B9B9B';
    if(isFinished === undefined && isFavorite)  statusColor = epColor.secondaryColor;
    let { hover } = this.state;
    let triSize = 30;
    let styles = {
      color: {
        color:timePoint && timePoint.type === 'ETA' ? 'rgb(33, 150, 243)': '#ffa000',
      },
      root: {
        display: 'inline-block',
        width: '270px',
        height: '150px',
        overflow: 'hidden',
        cursor: 'pointer',
        verticalAlign: 'middle',
        position: 'relative',
        transition:'none', 
      },
      status:{
        width: 0,
        height: 0,
        borderTop: `${triSize}px solid ${statusColor}`,
        borderLeft: `${triSize}px solid transparent`,
        right: 0,
        position: 'absolute',
      },
      dateType: {
        padding: '0px 16px',
        height: '20px',
        color: '#727272',
        fontSize: '12px',
        boxSizing: 'border-box',
      },
      portName: {
        color: '#727272',
      },
      shipName: {
        color: '#000',
      },
      typeName: {
        color: isFinished ? '#9B9B9B' : _.get(timePoint, 'type') === 'ETA' ? epColor.primaryColor : '#ffa000',
      },
      shipType: {
        paddingTop: '0px',
        paddingBottom: '26px',
        height: '46px',
        color: '#ffa000',
        boxSizing: 'border-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
      },
      title: {
        root: {
          paddingBottom: '0px',
          height: '36px',
          boxSizing: 'border-box',
        },
        left: {
          display: 'inline-block',
          float: 'left',
          width: 'calc(100% - 65px)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          wordBreak: 'keep-all',
        },
        right: {
          display: 'inline-block',
          float: 'right',
          // width: '60px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          wordBreak: 'keep-all',
          textAlign: 'right',
        },
      },
      orderType: {
        padding: '40px 16px',
        height: '48px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
        color:isFinished ? '#727272' : '#ffa000',
      },
      fav: {
        root: {
          padding: 12,
          width: 24,
          height: 24,
          position: 'absolute',
          right: 0,
          bottom: 0,
        },
        icon: {
          fill: isFinished ? '#9B9B9B' : '#EFAD0E',
        }
      }
    };

    styles.root = _.merge(styles.root, style);

    return styles;
  },

  render() {
    let {
      portName,
      shipName,
      shipType,
      timePoint,
      isFavorite,
      isFinished,
      read,
    } = this.props;
    let { hover } = this.state;
    let date = timePoint && new Date(timePoint.date);
    let time = '';
    if (date) {
      let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
      let minutes= date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
      time = `${hour}:${minutes}`;
    }

    date = date ? `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}` : '';
    let dateType = timePoint && timePoint.type;
    dateType = dateType ? dateType : '';
    let name = portName ? portName : '';
    let zDepth = hover ? 2 : 1;
    let title = `${shipName}${name}`;
    let notification = <CardNotifications status={read} isFinished={isFinished}/>;
    let showNotification = read && _.compact(read).length > 0;
    let orderStatus;
    if(isFinished !== undefined){
      orderStatus = isFinished ? this.t('nTextOrderHasFinished') : this.t('nTextOrderHasNotFinished');
    }

    const elFav = isFavorite ? (
      <CardText style={this.s('fav.root')}>
        <IconStar style={this.s('fav.icon')}/>
      </CardText>
    ) : null;

    return (
      <Card
        style={this.style('root')}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        onTouchTap={this._handleTouchTap}
        zDepth={zDepth}
      >
        <div style = {this.style('status')} />
        <CardText style={this.style('title.root')}>
          <div style={this.style('title.left')} title={title}>
            <span style={this.style('shipName')}>{shipName}</span>
          </div>
          <div style={this.style('title.right')} title={date}>
            <span style={this.style('typeName')}>{dateType}</span>
          </div>
        </CardText>
        <CardText style={this.style('dateType')}>
          <div style={this.style('title.left')} title={title}>
            <span style={this.style('portName')}>{name}</span>
          </div>
          <div style={this.style('title.right')} title={title}>
            <span>{date}</span>
          </div>
        </CardText>
        <CardText style={this.style('dateType')}>
          <div style={this.style('title.right')} title={title}>
            <span>{time}</span>
          </div>
        </CardText>
        <CardText
          title={showNotification ? null : orderStatus}
          style={this.style('orderType')}
        >
          {showNotification ? notification : orderStatus}
        </CardText>
        {elFav}
      </Card>
    );
  },

  _handleMouseEnter() {
    this.setState({
      hover: true,
    });
  },

  _handleMouseLeave() {
    this.setState({
      hover: false,
    });
  },

  _handleTouchTap() {
    let {
      onTouchTap,
      shipId,
    } = this.props;

    if (_.isFunction(onTouchTap)) {
      onTouchTap(shipId);
    }
  },
});

module.exports = DashboardCard;
