const React = require('react');
const PortView = require('~/src/sections/port/port-view');
const FlatButton = require('epui-md/FlatButton');
const Loading= require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const PortDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/PortDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    portId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      portId: ''
    };
  },

  getInitialState() {
    return {
      port: {},
      isFetching:true,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  componentWillMount() {
    this.fetchPort();
  },

  componentDidMount() {
    let actions = [
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />,
    ];

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  fetchPort(){
    if(global.api.epds && global.api.epds.findPortById){
        global.api.epds.findPortById.promise(this.props.portId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              port: res.response
            },()=>{
              if(this.props.positionDialog) this.props.positionDialog();
            });
          }else{
            //todo: deal with error
          }
        }).catch(err=>{
          //todo: deal with err
        });
    }
  },

  render() {
    return this.state.isFetching ? (
      <Loading />
    ):(
      <PortView
        ref="form"
        port = {this.state.port}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

});

module.exports = PortDialog;
