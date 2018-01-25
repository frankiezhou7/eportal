const React = require('react');
const _ = require('eplodash');
const RecommendableItem = require('./recommendable-item');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const RecommendableItems = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    //require(`epui-intl/dist/RecommendableItems/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    type: PropTypes.oneOf(['PORT','ORGANIZATION','NEWS','REGULATION']),
    items: PropTypes.array,
    onTopBtnTouchTap: PropTypes.func,
    onRecommendBtnTouchTap: PropTypes.func,
    onRecommendPlusBtnTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      type: 'PORT',
      items : [],
    };
  },

  getStyles() {
    let styles = {
      root: {
        marginTop: 20,
      },
    };

    return styles;
  },

  render() {
    let {items,type} = this.props;
    return (
      <div style = {this.style('root')}>
        {
          _.map(items,(item,index)=>{
            return(
              <RecommendableItem
                key = {item._id || index}
                item = {item}
                type = {type}
                onTopBtnTouchTap= {this.props.onTopBtnTouchTap}
                onRecommendBtnTouchTap= {this.props.onRecommendBtnTouchTap}
                onRecommendPlusBtnTouchTap= {this.props.onRecommendPlusBtnTouchTap}
              />
            );
          })
        }
      </div>
    );
  },
});

module.exports = RecommendableItems;
