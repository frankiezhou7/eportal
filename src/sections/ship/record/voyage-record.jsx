const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translation = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const moment = require('moment');
const format = 'DD/MMM/YYYY HH:mm';

const parseRecords = (records)=>{
  let newRecords = [];
  _.forEach(records,record=>{
    let label = null;
    if(record && record.subtype){
      if(/^\w{3}Change$/.test(record.subtype)){
        label = {
          before: record.subtype.substring(0,3),
          after: record.subtype.substring(0,3)
        };
      }else if(/^\w{3}To\w{3}$/.test(record.subtype)){
        label = {
          before: record.subtype.substring(0,3),
          after: record.subtype.substring(5,8)
        };
      }
    }
    if(label){
      record.label = label;
      newRecords.push(record);
    }
  });
  return newRecords;
}

const VoyageRecord = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: [
    require(`epui-intl/dist/Notification/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`)
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    records : PropTypes.array,
    nLabelNoRecord: PropTypes.string,
  },

  getDefaultProps() {
    return {
      records:[],
      nLabelNoVoyageRecord: 'No Voyage Record'
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        padding: 24,
      },
      record:{
        root:{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 14,
          marginBottom: 14,
          fontSize: 15,
          color: '#4A4A4A',
          alignItems: 'center',
        },
        exStatus:{
          padding: '5px 4px 2px 6px',
          backgroundColor:'#E8E8E8',
          display: 'inline-block',
          marginRight: 10,
          textDecoration: 'line-through',
          width: 190,
        },
        newStatus:{
          padding: '5px 4px 2px 6px',
          backgroundColor:'#E8E8E8',
          display: 'inline-block',
          marginRight: 10,
          width: 190,
        },
        time:{
          display: 'inline-block',
          marginLeft: 10,
        },
        user:{
          display: 'inline-block',
          marginLeft: 10,
        },
        current:{
          color: theme.epColor.orangeColor,
          backgroundColor: '#F8E5C4',
        },
        empty:{
          paddingTop: 50,
          paddingBottom: 50,
          width: '100%',
          textAlign: 'center',
        },
      }
    };

    return styles;
  },

  renderRecord(record, key){
    return (
      <div key = {record._id} style = {this.style('record.root')}>
        <div style = {this.style('left')}>
          { record.data.old ?
              <div style = {key == 0 ? this.style('record.exStatus','record.current') : this.style('record.exStatus')}>
                {this.t('nLabel'+record.label.before) +' '+ moment(record.data.old).format(format)}
              </div> : null
          }
          {
            record.data.new ?
              <div style = {key == 0 ? this.style('record.newStatus','record.current') : this.style('record.newStatus')}>
                {this.t('nLabel'+record.label.after) +' '+ moment(record.data.new).format(format)}
              </div> : null
          }
        </div>
        <div style = {this.style('right')}>
          <div style = {this.style('record.time')}>{moment(record.date).format(format)}</div>
          <div style = {this.style('record.user')}>{record.creator}</div>
        </div>
      </div>
    );
  },

  render() {
    let records = parseRecords(this.props.records);
    return _.isEmpty(records) ? (
      <div style = {this.style('record.empty')}>{this.t('nLabelNoVoyageRecord')}</div>
    ):(
      <div style={this.style('root')}>
        {_.map(records,(record,key)=>{
          return this.renderRecord(record,key);
        })}
      </div>
    );
  },

});

module.exports = VoyageRecord;
