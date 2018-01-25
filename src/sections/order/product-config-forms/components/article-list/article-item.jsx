const React = require('react');
const Paper = require('epui-md/Paper');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
import IconButton from 'epui-md/IconButton';
import SvgDelete from 'epui-md/svg-icons/action/delete';
import SvgEdit from 'epui-md/svg-icons/image/edit';

let PropTypes = React.PropTypes;

let ArticleItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    article: PropTypes.object,
    nLabelArticleName: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nTextRemove: PropTypes.string,
    articleChild: PropTypes.element,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
  },

  getDefaultProps() {
    return {
      article : {},
    };
  },

  getInitialState: function() {
    return {

    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    return {
      root:{
        padding: padding*10,
        marginBottom: padding*10,
        minHeight: 16,
        backgroundColor: '#edf5fe',
      },
      actions:{
        float: 'right',
        marginTop: -15,
      },
      action:{
        color: theme.primary1Color,
        marginRight: padding,
        cursor: 'pointer',
        width: 30,
      },
      btn: {
        width: 18,
        height: 18,
        fill: '#f5a623',
      }
    };
  },


  render() {
    let styles = this.getStyles();
    return (
      <Paper zDepth={1} style = {this.style('root')}>
        <div style = {this.style('actions')}>
          <span onClick = {this._handleEdit}>
            <IconButton
              key='_edit'
              style={this.style('action')}
              iconStyle={this.style('btn')}
            >
              <SvgEdit style={this.style('btn')} />
            </IconButton>
          </span>
          <span onClick = {this._handleRemove}>
            <IconButton
              key='_remove'
              style={this.style('action')}
              iconStyle={this.style('btn')}
            >
              <SvgDelete style={this.style('btn')} />
            </IconButton>
          </span>

        </div>
        {this.props.articleChild}
      </Paper>
    );
  },

  _handleEdit(){
    if(this.props.onEdit){
      this.props.onEdit(this.props.article.id);
    }
  },

  _handleRemove(){
    global.notifyOrderDetailsChange(true);
    if(this.props.onRemove){
      this.props.onRemove(this.props.article.id);
    }
  },

});

module.exports = ArticleItem;
