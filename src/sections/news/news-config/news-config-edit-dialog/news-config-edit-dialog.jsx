const React = require('react');
const NewsConfigEditor = require('../news-config-editor');
const Snackbar = require('epui-md/Snackbar');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const NewsConfigEditDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Homepage/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    newsConfigItemId: PropTypes.string,
    onSave: PropTypes.func,
    type: PropTypes.string,
  },

  getDefaultProps() {
    return {
      newsConfigItemId: ''
    };
  },


  getInitialState() {
    return {
      setting: {},
      isFetching: this.props.newsConfigItemId ? true : false,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },


  componentWillMount() {
    if(this.props.newsConfigItemId){
      this.fetchSettings();
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


  fetchSettings(){
    if(global.api.epds && global.api.epds.findSettingsById){
        global.api.epds.findSettingsById.promise(this.props.newsConfigItemId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              newsConfigItem: res.response
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
    <div>
      <NewsConfigEditor
        ref="form"
        newsConfigItem = {this.state.newsConfigItem}
        type = {this.props.type}
      />
      <Snackbar
        open={this.state.open}
        message={this.state.tip}
        autoHideDuration={3000}
        onRequestClose={this._handleRequestClose}
      />
    </div>
    );
  },

  _handleRequestClose(timeout) {
    if(timeout === 'timeout')
    this.setState({
      open:false,
      tip: null
    });
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleSave(){
    let { type } = this.props;
    this.refs.form.isValid().then(valid => {
      if(valid && !valid[0]) {
        if(type === 'banner') {
          this.setState({open: true, tip: this.t('nTextShouldUploadBanner')});
        }
      }
      if(!_.includes(valid, false)){
        let { newsConfigItemId, onSave } = this.props;
        let newsConfigItem = this.refs.form.getValue();
        if(newsConfigItemId) { newsConfigItem = _.assign({}, newsConfigItem, {_id: newsConfigItemId, __v: this.state.newsConfigItem.__v}); }
        if(onSave) onSave(newsConfigItem);
        this._handleCancel();
      }
    })
  },
});

module.exports = NewsConfigEditDialog;
