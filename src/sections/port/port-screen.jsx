const React = require('react');
const Port = require('./port');
const { getSubPathComponents } = require('~/src/utils');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const PortViewContainer = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/PortDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    params : PropTypes.object,
    nTextGetPortFailed: PropTypes.string,
  },

  getDefaultProps() {
    return {
      params: {},
    };
  },

  getInitialState(){
    return {
      port: {},
      isFetching:true,
    };
  },

  getStyles() {
    return {};
  },

  componentWillMount() {
    this.fetchPort(this.props.params.portId);
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.params.portId!==nextProps.params.portId){
      this.setState({isFetching: true});
      this.fetchPort(nextProps.params.portId);
    }
  },

  fetchPort(portId){
    if(global.api.epds && global.api.epds.findPortById){
        global.api.epds.findPortById.promise(portId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              port: res.response
            });
          }else{
            global.tools.toSubPath(`/404`);
          }
        }).catch(err=>{
          global.tools.toSubPath(`/404`); 
          debug(err);
        });
    }
  },

  render() {
    const segs = getSubPathComponents(global.location.pathname);
    return (
      <Port
        {...this.props}
        target = {segs[2]}
        isFetching = {this.state.isFetching}
        routerMode = {true}
        port={this.state.port}
      />
    );
  }
});

module.exports = PortViewContainer;
