const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Avatar = require('epui-md/Avatar');
const IconThumb = require('epui-md/ep/IconThumb');
const ProductIcons = require('./product-icons');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const warning = require('fbjs/lib/warning');
const { Map, List } = require('epimmutable');

const ICON_OUTER_SIZE = 48;
const ICON_INNER_SIZE = 34;

const ServiceProductList = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ServiceProductList/${__LOCALE__}`),
    require(`epui-intl/dist/ServiceProducts/${__LOCALE__}`)
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    order: PropTypes.object,
    mode: PropTypes.string,

    products: PropTypes.object,
    filter: PropTypes.string,
    disabled: PropTypes.bool,

    nTitleMainProducts: PropTypes.string,
    nTitleApplicableProducts: PropTypes.string,
    nTitleOtherProducts: PropTypes.string,
    nLabelNoProductAvailable: PropTypes.string,
    nLabelLoadingProducts: PropTypes.string,
    nLabelOtherProducts: PropTypes.string,
    onProductTouchTap: PropTypes.func,
  },

  getDefaultProps() {
    return {
      filter: '',
      showSugguestions: false,
      disabled: false,
    };
  },

  componentWillReceiveProps(nextProps) {

  },

  getStyles() {
    let theme = this.context.muiTheme;

    return {
      root: {
        width: '100%',
        padding: 14,
      },
      suggestion: {
        base: {},
        title: {},
        entries: {},
      },
      group: {
        base: {
          width: '100%',
        },
        title: {
          margin: '0 8px',
          fontWeight: 'bold',
          fontSize: '1em',
        },
        entries: {},
      },
      message: {
        color: theme.palette.disabledColor,
        width: '100%',
        textAlign: 'center',
        padding: '16px 0',
      },
      avatar: {
        fill: '#FFF',
        width: ICON_INNER_SIZE,
        height: ICON_INNER_SIZE,
        border: 'none',
      },
    };
  },

  renderGroup(title, key, items) {
    let { disabled, onProductTouchTap, order } = this.props;
    let styles = this.getStyles();

    disabled = disabled || !_.isFunction(onProductTouchTap);

    let elItems = [];

    for(let item of items) {
      let Icon = ProductIcons[item.code] || ProductIcons.UNKNOWN;

      elItems.push(
        <IconThumb
          key={item._id}
          ckey={item._id}
          title={this.t(`nLabelProductName${item.code}`)}
          disabled={order.hasProduct(item.code)}
          icon={Icon}
          iconBackgroundColor = {this.context.muiTheme.palette.primary1Color}
          onTouchTap={this._handleItemTouchTap.bind(this, item)}
          hint={this.t(`nLabelProductDescription${item.code}`)}
        />
      );
    }

    let elTitle = title ? (
      <p style={this.style('group.title')}>{title}</p>
    ) : null;

    return (
      <div key={key} style={this.style('group.base')}>
        {elTitle}
        <div style={this.style('group.entries')}>
          {elItems}
        </div>
      </div>
    );
  },

  render() {
    let {
      products,
      filter,
    } = this.props;

    if(!products) { return null; }

    let elNoProduct = (
      <div key='no-product' style={this.style('root', 'message')}>
        {this.t('nLabelNoProductAvailable')}
      </div>
    );

    if(products.getMeta('loading')) {
      return (
        <div style={this.style('root', 'message')}>
          {this.t('nLabelLoadingProducts')}
        </div>
      );
    }

    let elBody = [];

    let {
      main,
      applicable,
      other,
    } = this._groupItems(products);

    if(main.size > 0) {
      elBody.push(this.renderGroup(this.t('nTitleMainProducts'), 'main', main));
    }
    if(applicable.size > 0) {
      elBody.push(this.renderGroup(this.t('nTitleApplicableProducts'), 'applicable', applicable));
    }
    if(other.size > 0) {
      elBody.push(this.renderGroup(this.t('nTitleOtherProducts'), 'other', other));
    }

    if(elBody.length <= 0) {
      elBody.push(elNoProduct);
    }

    return (
      <div style={this.style('root')}>
        {elBody}
      </div>
    );
  },

  _handleItemTouchTap(item) {
    if(_.isFunction(this.props.onProductTouchTap)) {
      this.props.onProductTouchTap(this, item);
    }
  },

  _groupItems(items) {
    if(!items) { return null; }

    let type = this.props.order.type.code;

    let main = List().asMutable();
    let applicable = List().asMutable();
    let other = List().asMutable();

    items.forEach((item) => {
      if(item.isForOrderType(type)) {
        main = main.push(item);
        return;
      }
      if(item.isInCategory('PDCOM')) {
        applicable = applicable.push(item);
        return;
      }
    });

    let sort = (a, b) => {
      if(a.sort > b.sort) return 1;
      if(a.sort < b.sort) return -1;
      return 0;
    };

    main = this._filterItems(main.sort(sort));
    applicable = this._filterItems(applicable.sort(sort));
    other = this._filterItems(other.sort(sort));

    return {
      main: main.asImmutable(),
      applicable: applicable.asImmutable(),
      other: other.asImmutable(),
    };
  },

  _filterItems(items) {
    let filter = this.props.filter;
    if(!filter) { return items; }
    let tester = new RegExp(filter);
    return items.filter(item => tester.test(this.t(item.name)));
  },
});

module.exports = ServiceProductList;
