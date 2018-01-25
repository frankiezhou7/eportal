const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const SPARE_PARTS_CODE = 'OLASP';

const DialogChild = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    shipment: PropTypes.object,
    style: PropTypes.object,
    articleTypes : PropTypes.array,
    nLabelArticleCount: PropTypes.string,
    nLabelArticleWeight: PropTypes.string,
    nLabelArticleDescription: PropTypes.string,
    nLabelArticleAddress: PropTypes.string,
    nLabelCountUnit: PropTypes.string,
    nLabelTextProductWeightUnit: PropTypes.string,
  },

  getDefaultProps() {
    return {
      shipment: {},
      articleTypes: [],
    };
  },

  getInitialState() {
    let isSparePartsChoosen = true;
    let articleTypes = this.props.articleTypes;
    let selectedIndex = 0;
    let shipment = this.props.shipment;
    if(shipment && shipment.articleType && shipment.articleType !== SPARE_PARTS_CODE) {
      isSparePartsChoosen = false;
    }
    _.forEach(articleTypes, (articleType, index) => {
      if(shipment && shipment.articleType && shipment.articleType === articleType.code) {
        selectedIndex = index;
      }
    });

    return {
      isSparePartsChoosen: isSparePartsChoosen,
      selectedIndex: selectedIndex,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let rootStyle = {
      display: 'bolck',
    };

    if(this.props.style) {
      _.merge(rootStyle, this.props.style);
    }

    return {
      root: rootStyle,
      menu: {
        display: 'inline-block',
        width: '200px',
        verticalAlign: 'bottom',
        textAlign: 'left',
      },
      underlineStyle: {
        marginTop: '-9px',
      },
      article: {
        marginRight: `${padding * 5}px`,
        display: 'inline-block',
        width: '120px',
        verticalAlign: 'bottom',
      },
      articleUnit: {
        marginLeft: `${padding * 10}px`,
        display: 'inline-block',
        width: '150px',
        height: '64px',
        verticalAlign: 'bottom',
      },
      articleLong: {
        marginRight: `${padding * 5}px`,
        display: 'inline-block',
        width: '720px',
        verticalAlign: 'middle',
      },
      articleUnderLine: {
        marginBottom : '1px',
      }
    };
  },

  getValue() {
    let shipment = this.props.shipment;
    let articleTypes = this.props.articleTypes;
    shipment.articleName = articleTypes && articleTypes[this.refs.articleType.getValue()].name;
    shipment.articleType = this.refs.articleType.getValue();
    shipment.address = this.refs.articleAddress.getValue();
    if (this.state.isSparePartsChoosen) {
      shipment.count = this.refs.articleCount.getValue();
      shipment.weight = this.refs.articleWeight.getValue();
      shipment.description = this.refs.articleDescription.getValue();
    }
    return shipment;
  },

  render() {
    let shipment = this.props.shipment;
    let articleTypes = this.props.articleTypes;
    let menuItems = _.reduce(articleTypes, (items, articleType, index) => {
      let idx = _.findIndex(articleTypes, ['code', articleType.code]);
      let item = <MenuItem key={index} value={idx} primaryText={articleType.name} />;
      items.push(item);
      return items;
    }, []);

    let dropDownMenu = (
      <DropDownMenu
        ref='articleType'
        key='articleType'
        maxHeight={this.state.isSparePartsChoosen ? 185 : 120}
        onChange={this._handleArticleTypeChange}
        style={this.style('menu')}
        underlineStyle={this.style('underlineStyle')}
        value={this.state.selectedIndex}
        defaultValue={0}
      >
        {menuItems}
      </DropDownMenu>
    );

    let countElem = this.state.isSparePartsChoosen ? (
      <TextFieldUnit
        ref='articleCount'
        key='articleCount'
        defaultValue={shipment ? shipment.count : ''}
        floatingLabelText={this.t('nLabelArticleCount')}
        style={this.style('articleUnit')}
        underlineStyle={this.style('articleUnderLine')}
        unitLabelText={this.t('nLabelCountUnit')}
      />
    ) : null;

    let weightElem = this.state.isSparePartsChoosen ? (
      <TextFieldUnit
        ref='articleWeight'
        key='articleWeight'
        defaultValue={shipment ? shipment.weight : ''}
        floatingLabelText={this.t('nLabelArticleWeight')}
        style={this.style('articleUnit')}
        underlineStyle={this.style('articleUnderLine')}
        unitLabelText={this.t('nLabelTextProductWeightUnit')}
      />
    ) : null;

    let descriptionElem = this.state.isSparePartsChoosen ? (
      <TextField
        ref='articleDescription'
        key='articleDescription'
        defaultValue={shipment ? shipment.description : ''}
        floatingLabelText={this.t('nLabelArticleDescription')}
        style={this.style('articleLong')}
      />
    ) : null;

    let addressElem = (
      <TextField
        ref='articleAddress'
        key='articleAddress'
        style={this.style('articleLong')}
        defaultValue={shipment ? shipment.address : ''}
        floatingLabelText={this.t('nLabelArticleAddress')}
      />
    );

    return(
      <div style={this.style('child')}>
        {dropDownMenu}
        {countElem}
        {weightElem}
        {descriptionElem}
        {addressElem}
      </div>
    );
  },

  _handleArticleTypeChange(e, index, value) {
    let articleTypes = this.props.articleTypes;
    if(articleTypes[value].code === SPARE_PARTS_CODE) {
      this.setState({
        isSparePartsChoosen: true,
        selectedIndex: value,
      });
    } else if(this.state.isSparePartsChoosen) {
      this.setState({
        isSparePartsChoosen: false,
        selectedIndex: value,
      });
    } else {
      this.setState({
        selectedIndex: value,
      });
    }
  },
});

module.exports = DialogChild;
