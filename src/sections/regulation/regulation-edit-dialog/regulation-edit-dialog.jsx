const React = require('react');
const RegulationEditor = require('~/src/sections/regulation/regulation-editor');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const RegulationEditDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Regulation/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    regulationId: PropTypes.string,
    onSave: PropTypes.func,
  },

  getDefaultProps() {
    return {
      regulationId: ''
    };
  },


  getInitialState() {
    return {
      regulation: {},
      isFetching: this.props.regulationId ? true : false,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },


  componentWillMount() {
    if(this.props.regulationId){
      this.fetchRegulations();
    }
  },


  componentDidMount() {
    let actions = [
      <FlatButton
        key="save"
        ref={(ref) => this.save = ref}
        label= {this.t('nTextSave')}
        secondary
        onTouchTap={this._handleSave}
      />,

      <FlatButton
        key="publish"
        ref={(ref) => this.publish = ref}
        label= {this.t('nTextPublish')}
        secondary
        onTouchTap={this._handlePublish}
      />,
      <FlatButton
        key="publishRecommendable"
        ref={(ref) => this.publishRecommendable = ref}
        label= {this.t('nTextPublishAndRecommendable')}
        secondary
        onTouchTap={this._handlePublishAndRecommendable}
      />,

      <FlatButton
        key="close"
        ref={(ref) => this.close = ref}
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


  fetchRegulations(){
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
    return this.state.isFetching ? <Loading /> : (
      <RegulationEditor
        ref="form"
        regulationItem = {this.state.regulation}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleSave(){
    let regulation = this.refs.form.getValue();
    this.refs.form.isValid().then(valid => {
      if(!_.includes(valid, false) && this.props.onSave) {
        this.props.onSave(regulation);
        this._handleCancel();
      }
    })
  },

  _handlePublish(){
    let regulation = this.refs.form.getValue();
    regulation.isPublished = true;
    if(this.props.onSave) this.props.onSave(regulation);
    this._handleCancel();
  },

  // _handlePublishAndTop(){
  //   let regulation = this.refs.form.getValue();
  //   regulation.isPublished = true;
  //   regulation.isOnTop = true;
  //   if(this.props.onSave) this.props.onSave(regulation);
  //   this._handleCancel();
  // },

  _handlePublishAndRecommendable(){
    let regulation = this.refs.form.getValue();
    regulation.isPublished = true;
    regulation.isRecommendable = true;
    if(this.props.onSave) this.props.onSave(regulation);
    this._handleCancel();
  },

});

module.exports = RegulationEditDialog;
