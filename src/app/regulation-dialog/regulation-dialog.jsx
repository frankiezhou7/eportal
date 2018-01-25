const React = require('react');
const RegulationView = require('~/src/sections/regulation');
const FlatButton = require('epui-md/FlatButton');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const RegulationDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    regulationId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      regulationId: ''
    };
  },


  getInitialState() {
    return {
      regulation: {},
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
    this.fetchRegulation();
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


  fetchRegulation(){
    if(global.api.epds && global.api.epds.findRegulationById){
        global.api.epds.findRegulationById.promise(this.props.regulationId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              regulation: res.response
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
    return (
      <RegulationView
        ref="form"
        regulationItem = {this.state.regulation}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

});

module.exports = RegulationDialog;
