const React = require('react');
const Recommendations = require('~/src/sections/manage/recommendations/recommendations-dialog');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const RecommendationsDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    type: PropTypes.oneOf(['PORT','ORGANIZATION','NEWS','REGULATION']),
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
    return {};
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
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

  render() {
    return (
      <Recommendations
        ref="form"
        type = {this.props.type}
        role = {this.props.role}
        onRecommendBtnTouchTap= {this.props.onRecommendBtnTouchTap}
        onRecommendPlusBtnTouchTap= {this.props.onRecommendPlusBtnTouchTap}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

});

module.exports = RecommendationsDialog;
