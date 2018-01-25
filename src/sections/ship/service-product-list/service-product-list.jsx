let React = require('react');
let PropTypes = React.PropTypes;
let StylePropable = require('~/src/mixins/style-propable');


let product = {
  suggestions: [{
    
  }]
}

let component = React.createClass({
  mixins: [StylePropable],

  contextTypes: {

  },

  propTypes: {
    product: PropTypes.object.isRequired,
    groupby: PropTypes.string.oneOf(['category']),
    sortby: PropTypes.string.oneOf(['frequncy', 'name']),
    filter: PropTypes.string,
    showSugguestions: PropTypes.bool
  },

  getDefaultProps() {
    return {
      groupby: 'category',
      sortby: 'name',
      filter: null,
      showSugguestions: false
    };
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount() {

  },

  componentWillUnmount() {

  },

  componentWillUpdate() {

  },

  getStyles() {
    return {};
  },

  _groupItems(items) {
    if(!items) { return null; }

    let res = {
      '_rest' : []
    };

    if(!this.props.groupby) {
      res['_rest'] = items;
      return;
    }

    let groupby = this.props.groupby;

    for(let item of items) {
      if(!item.tags) {
        res['_rest'].push(item);
        continue;
      }
      for(let tag of item.tags) {
        if(tag.name !== groupby || !tag.value) { continue; }
        if(!res[tag.value]) {
          res[tag.value] = [];
        }
        res[tag.value].push(item);
      }
    }

    return res;
  },

  _sortItems(items) {
    if(!this.props.sortby) { return items; }
    return _.sortBy(items, this.props.sortby);
  },

  render() {
    let styles = this.getStyles();

    return (
      null
    );
  }
});

module.exports = component;
