const React = require('react');
const _ = require('eplodash');
const SearchTextField  =  require('epui-md/ep/SearchTextField');
const RecommendableItems = require('./recommendable-items');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const RecommendationsDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    type: PropTypes.oneOf(['PORT','ORGANIZATION','NEWS', 'REGULATION']),
    role: PropTypes.string,
    onTopBtnTouchTap: PropTypes.func,
    onRecommendBtnTouchTap: PropTypes.func,
    onRecommendPlusBtnTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      type: 'PORT'
    };
  },

  getInitialState() {
    return {
      searchValues:[],
      searchText: '',
      pagination:{
        cursor: 0,
        size: 10,
        total: 0,
      },
    };
  },

  getValue() {
    return this.airDraft.getValue();
  },


  getStyles() {
    let styles = {
      root: {

      },
      textField:{

      },
      result:{
        marginTop: 57,
        maxHeight: 250,
        overflow: 'scroll',
      },
      header:{
        fontSize: 15,
      },
      empty:{
        marginTop: 20,
        textAlign: 'center'
      }
    };

    return styles;
  },

  handleSearch(){

  },

  handleInputChange(value){
    value = _.replace(value, '\'','');
    if(value.length >= 2){
      this.setState({
        isFetching: true,
        searchText: value
      });
      switch (this.props.type) {
        case 'PORT':
          this.searchPorts({
            cursor: 0,
            size: 10,
            query: {
              name:value
            }
          },{
            visibleStatus: {
              $ne:2
            }
          });
          break;
        case 'ORGANIZATION':
          let condition = {};
          if(this.props.role === 'OROT'){
            condition = {
              roles: {$in: ['OROW', 'ORCT', 'ORSH', 'ORRC']},
              type: {
                $ne: 'byRegister'
              },
              visibleStatus: {
                $ne: 2
              },
              $or:[{ parent:null },{ parent:{ $exists:false } }]
            }
          }else{
            let roles = this.props.role == 'ORGA' ? {$in:[ 'ORGA','ORCA','OROW','ORCH']} : {$in:[this.props.role]};
            condition = {
              roles: roles,
              type: {
                $ne: 'byRegister'
              },
              visibleStatus: {
                $ne:2
              },
              $or:[{ parent:null },{ parent:{ $exists:false } }]
            }
          }
          this.searchOrganizations({
            cursor: 0,
            size: 10,
            query: {
              name:value,
            }
          },condition);
          break;
        case 'NEWS':
          this.searchNews({
            cursor: 0,
            size: 10,
            query: {
              title : value,
              content: value
            }
          },{
            isPublished: true
          });
          break;
        case 'REGULATION':
          this.searchRegulations({
            cursor: 0,
            size: 10,
            query: {
              title : value,
              english: value
            }
          },{
            isPublished: true
          });
          break;
        default:
      }
    }
  },

  searchPorts(pagination,condition){
    if(global.api.epds && global.api.epds.searchPorts){
        global.api.epds.searchPorts.promise(pagination,condition).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              searchValues: res.response.entries
            });
          }else{
            alert('获取数据错误');
            //todo: deal with error
          }
        }).catch(err=>{
          alert('获取数据错误'+err);
          //todo: deal with err
        });
    }
  },

  searchOrganizations(pagination,condition){
    if(global.api.epds && global.api.epds.searchOrganizations){
        global.api.epds.searchOrganizations.promise(pagination,condition).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              searchValues: res.response.entries
            });
          }else{
            alert('获取数据错误');
            //todo: deal with error
          }
        }).catch(err=>{
          alert('获取数据错误'+err);
          //todo: deal with err
        });
    }
  },

  searchNews(pagination,condition){
    if(global.api.epds && global.api.epds.searchNews){
        global.api.epds.searchNews.promise(pagination,condition).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              searchValues: res.response.entries
            });
          }else{
            alert('获取数据错误');
            //todo: deal with error
          }
        }).catch(err=>{
          alert('获取数据错误'+err);
          //todo: deal with err
        });
    }
  },

  searchRegulations(pagination,condition){
    if(global.api.epds && global.api.epds.searchRegulations){
        global.api.epds.searchRegulations.promise(pagination,condition).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              searchValues: res.response.entries
            });
          }else{
            alert('获取数据错误');
            //todo: deal with error
          }
        }).catch(err=>{
          alert('获取数据错误'+err);
          //todo: deal with err
        });
    }
  },


  render() {
    let items = [];
    let searchText = this.state.searchText;
    switch (this.props.type) {
      case 'PORT':
        items= _.map(this.state.searchValues, value=>{
          return _.pick(value,'_id','name','code','dateUpdate');
        });
        break;
      case 'ORGANIZATION':
        items= _.map(this.state.searchValues, value=>{
          return _.pick(value,'_id','name','dateCreate','dateUpdate');
        });
        break;
      case 'NEWS':
        items= _.map(this.state.searchValues, value=>{
          return {
            _id: value._id,
            name: value.title,
            type: 'News',
            dateUpdate: value.dateUpdate
          };
        });
        break;
      case 'REGULATION':
        items= _.map(this.state.searchValues, value=>{
          return {
            _id: value._id,
            name: value.title,
            type: 'Regulation',
            dateUpdate: value.dateUpdate
          };
        });
        break;
      default:

    }
     _.map(this.state.searchValues, value=>{
      let result = {};
      return _.pick(value,'_id','name','code','dateUpdate');
    });

    const searchResluts = (
      <div style = {this.style('result')}>
        <div style = {this.style('header')}>{this.t('nTextSearchResults')+':'}</div>
        <div style = {this.style('content')}>
          {items.length === 0 && searchText.length >= 2 ?
            <div style = {this.style('empty')}>{this.t('nTextNoResults')}</div> :
            <RecommendableItems
              type = {this.props.type}
              items = {items}
              onTopBtnTouchTap= {this.props.onTopBtnTouchTap}
              onRecommendBtnTouchTap= {this.props.onRecommendBtnTouchTap}
              onRecommendPlusBtnTouchTap= {this.props.onRecommendPlusBtnTouchTap}
            />
          }
        </div>
      </div>
    );

    return (
      <div style = {this.style('root')}>
        <SearchTextField
          ref = 'searchText'
          style = {this.style('textField')}
          searchText = {this.t('nTextSearch'+_.capitalize(this.props.type))}
          width = {536}
          onChange = {this.handleInputChange}
          onSearch = {this.handleSearch}
        />
        {searchResluts}
      </div>
    );
  },
});

module.exports = RecommendationsDialog;
