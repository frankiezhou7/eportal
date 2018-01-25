const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Colors = require('epui-md/styles/colors');

const BoardTime = React.createClass({
  mixins: [AutoStyle],

  propTypes: {
    label: React.PropTypes.string,
    isEst: React.PropTypes.string,
    dateLabel: React.PropTypes.string,
    timeLabel: React.PropTypes.string,
    arrivalUpdate: React.PropTypes.bool,
    berthUpdate: React.PropTypes.bool,
    departureUpdate: React.PropTypes.bool,
    type: React.PropTypes.string,
    isEditing: React.PropTypes.bool,
    showReporter: React.PropTypes.bool,
    fold: React.PropTypes.bool,
    foldHeight: React.PropTypes.number,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getTheme() {
    return this.context.muiTheme.voyageStatusBanner;
  },

  getStyles() {
    let palette = this.context.muiTheme.palette;
    let theme = this.getTheme();

    let height = '92px';
    let heightWithReporter = '116px';
    let heightEditing = '154px';
    let heightFold = `${this.props.foldHeight}px`;

    let contentHeight = (
      this.props.isEditing ?
      '0px':
      (
        this.props.fold ?
        heightFold :
        (
          this.props.showReporter ?
          heightWithReporter :
          height
        )
      )
    );

    let styles = {
      viewBoard: {
        time: {
          root: {
            float: 'left',
            margin: '0 10px 0 0',
            height: '100%',
            minWidth: '165px',
            lineHeight: contentHeight,
            boxSizing: 'border-box',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
          },
          label: {
            margin: '0 4px',
            color: '#0059AA',
            fontWeight: '500',
          },
          dateLabel: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textArrivalColor,
            fontWeight: '700',
          },
          dateLabelEst: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textEstArrivalColor,
            fontWeight: '700',
          },
          timeLabel: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textArrivalColor,
          },
          timeLabelEst: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textEstArrivalColor,
          },
          timeDateUpdate: {
            margin: '0 4px',
            color: '#e44d3c',
            fontWeight: '700',
          },
        }
      },
    };

    return styles;
  },

  render() {
    let {
      label,
      isEst,
      dateLabel,
      timeLabel,
      arrivalUpdate,
      berthUpdate,
      departureUpdate,
      type,
    } = this.props;

    let update = false;
    if(type === 'arrival'){
      update = arrivalUpdate;
    }else if(type === 'berth'){
      update = berthUpdate;
    }else if(type === 'departure'){
      update = departureUpdate;
    }

    return (
      <div style={this.style('viewBoard.time.root')}>
        <span style={this.style('viewBoard.time.label')}>{label}</span>
        <span style={isEst ? update ? this.style('viewBoard.time.timeDateUpdate') : this.style('viewBoard.time.dateLabelEst')
                    : update ? this.style('viewBoard.time.timeDateUpdate') : this.style('viewBoard.time.dateLabel')}
        >
          {dateLabel}
        </span>
        <span style={isEst ? update ? this.style('viewBoard.time.timeDateUpdate') : this.style('viewBoard.time.timeLabelEst')
                    : update ? this.style('viewBoard.time.timeDateUpdate') : this.style('viewBoard.time.timeLabel')}
        >
          {timeLabel}
        </span>
      </div>
    );
  },
});

module.exports = BoardTime;
