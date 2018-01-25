const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const AutoStyle = require('epui-auto-style').mixin;
const ClearButton = require('epui-md/svg-icons/content/clear');
const DivButton = require('./div-button');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const FlatButton = require('epui-md/FlatButton');
const IconButton = require('epui-md/IconButton');
const IconMenu = require('epui-md/IconMenu');
const MenuItem = require('epui-md/MenuItem');
const MoreVertIcon = require('epui-md/svg-icons/navigation/more-vert');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const RemoveButton = require('epui-md/svg-icons/content/remove');
const SelectField = require('epui-md/SelectField');
const Table = require('epui-md/ep/Table/Table');
const TableBody = require('epui-md/ep/Table/TableBody');
const TableHeader = require('epui-md/ep/Table/TableHeader');
const TableHeaderColumn = require('epui-md/ep/Table/TableHeaderColumn');
const TableRow = require('epui-md/ep/Table/TableRow');
const TableRowColumn = require('epui-md/ep/Table/TableRowColumn');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
const moment = require('moment');
const TO_FIXED_LEN = 2;
const CT_CODE_OTHERS = 'CTOTHERS';

const ORDER_ENTRY_STATUS = require('~/src/shared/constants').ORDER_ENTRY_STATUS;

const PriceTableView = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    costTypes: PropTypes.any,
    isEstimated: PropTypes.bool,
    costItemsEstimated: PropTypes.array,
    nLabelAmountAct: PropTypes.string,
    nLabelAmountEcr: PropTypes.string,
    nLabelAmountEst: PropTypes.string,
    nLabelChooseCostType: PropTypes.string,
    nLabelClickToEdit: PropTypes.string,
    nLabelCostTypeName: PropTypes.string,
    nLabelETA: PropTypes.string,
    nLabelETD: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nLabelInvoice: PropTypes.string,
    nLabelNote: PropTypes.string,
    nLabelNumber: PropTypes.string,
    nTextAddChargeFee: PropTypes.string,
    nTextRemove: PropTypes.string,
    nTextSave: PropTypes.string,
    nTitlePriceTotal: PropTypes.string,
    onAddCostType: PropTypes.func,
    onRemoveCostType: PropTypes.func,
    order: PropTypes.object,
    products: PropTypes.any,
    segment: PropTypes.object,
    ship: PropTypes.object,
  },

  getDefaultProps() {
    return {
      costTypes: null,
      isEstimated: true,
      order: null,
      products: null,
      segment: null,
      ship: null,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let fontSize = 13;
    let theme = this.getTheme();

    let styles = {
      root: {
        border: '1px solid #DCDCDC',
        padding: padding * 5,
        marginBottom: padding * 5,
        minHeight: 16,
      },
      title: {
        fontSize: 15,
        fontWeight: 500,
        textAlign: 'left',
        paddingBottom: padding * 4,
        color: theme.primary1Color,
        marginTop: padding * 12,
        borderBottom: 'none',
      },
      tableStyle: {
        position: 'relative',
        backgroundColor: 'transparent',
        textAlign: 'center',
        border: '1px solid #DCDCDC',
        width: '100%',
      },
      textField: {
        width: 'initial',
      },
      underlineStyle: {
        display: 'none',
      },
      hintStyle: {
        width: '100%',
        fontSize: fontSize,
      },
      inputStyle: {
        fontSize: fontSize,
        textOverflow: 'ellipsis',
        textAlign: 'right',
      },
      costType: {},
      productName: {
        textAlign: 'left',
        paddingLeft: 10,
        fontSize: 15,
        color: theme.canvasColor,
        backgroundColor: '#F8E5C4',
        border: 'none',
        height: 24,
        color: '#4a4a4a',
      },
      productPrice: {
        textAlign: 'right',
        paddingLeft: 6,
        paddingRight: 10,
        fontSize: 15,
        color: theme.canvasColor,
        backgroundColor: '#F8E5C4',
        border: 'none',
        height: 24,
        color: '#4a4a4a',
      },
      col: {
        textAlign: 'right',
        paddingLeft: 0,
        paddingRight: 10,
      },
      colName: {
         textAlign: 'left',
         paddingLeft: 6,
         paddingRight: 10,
      },
      toolBar: {
        border: '1px solid #e0e0e0',
        borderBottom: 'none',
      },
      toolBarBtn: {
        fill: '#fff',
      },
      remove: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      removeBtn: {
        backgroundColor: 'transparent',
        marginLeft: padding * 4,
        minWidth: 'none',
      },
      tool:{
        width: '50%',
        textAlign: 'right',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      toolBtn: {
        textAlign: 'right',
        paddingRight: 0,
      },
      menu: {
        maxHeight: 300,
      },
      menuStyle: {
        textAlign: 'left',
      },
      addChargeFee: {
        border: '1px solid #e0e0e0',
        borderTop: 'none',
      },
      addBtn: {
        verticalAlign: 'middle',
        fill: theme.primary1Color,
      },
      addBtnLabel: {
        display: 'inline-block',
        marginLeft: padding * 3,
        verticalAlign: 'middle',
        color: theme.primary1Color,
      },
      addChargeBtn: {
        display: 'inline-block',
        padding: '10px 23px',
        cursor: 'pointer',
      },
      menuUnderlineStyle: {
        borderBottom: 'none',
      },
      menuLabelStyle: {
        fontSize: fontSize,
      },
      selectHintStyle: {
        fontSize: fontSize,
        bottom: 12,
      },
      titleContainer: {
        marginBottom: 12,
        fontSize: 16,
      },
      priceTotal: {
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      priceNumber: {
        display: 'inline-block',
        marginLeft: 12,
        fontWeight: 500,
        color: theme.accent1Color,
        verticalAlign: 'middle',
      },
      shipInfoLeft: {
        float: 'left',
        fontSize: 16,
        fontWeight: 500,
      },
      shipInfoRight: {
        float: 'right',
        fontSize: 10,
        fontWeight: 500,
      },
      timePoint: {
        display: 'inline-block',
      },
      shipInfoRightSpan: {
        display: 'inline-block',
        marginRight: 6,
      },
      shipInfoRightSpanTimePoint: {
        display: 'inline-block',
        marginRight: 16,
        color: '#989595',
      },
      shipInfoRightSpanTime: {
        display: 'inline-block',
        marginRight: 6,
        color: '#989595',
      },
      price: {
        clear: 'both',
        paddingTop: 10,
        fontSize: 16,
        textAlign: 'right',
      }
    };

    return styles;
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.costItemsEstimated) {
      this.setState({costItemsEstimated: nextProps.costItemsEstimated});
    }
  },

  renderTitle(costItems) {
    let segment = this.props.segment;
    let position = segment.position;
    let schedule = segment.schedule || {};
    let timePoints = schedule && schedule.timePoints || {};
    let etaTime,etdTime;
    if(timePoints) {
      if(timePoints.arrival.estimated) etaTime = this._displayDate(timePoints.arrival.time);
      if(timePoints.departure.estimated) etdTime = this._displayDate(timePoints.departure.time);
    }
    let etaTimeEle, etdTimeEle;
    if(etaTime) {
      etaTimeEle = (
        <div style={this.style('timePoint')}>
          <span style={this.style('shipInfoRightSpan')}>{this.t('nLabelETA')}</span>
          <span style={this.style('shipInfoRightSpanTimePoint')}>{etaTime}</span>
        </div>
      );
    }
    if(etdTime) {
      etdTimeEle = (
        <div style={this.style('timePoint')}>
          <span style={this.style('shipInfoRightSpan')}>{this.t('nLabelETD')}</span>
          <span style={this.style('shipInfoRightSpanTimePoint')}>{etdTime}</span>
        </div>
      );
    }

    return (
      <div style={this.style('titleContainer')}>
        <div style={this.style('shipInfo')}>
          <div style={this.style('shipInfoLeft')}>
            <span style={this.style('shipInfoLeftSpan')}>{this.props.ship.get('name')}</span>
            <span style={this.style('shipInfoLeftSpan')}> - </span>
            <span style={this.style('shipInfoLeftSpan')}>{this.props.segment.get('arrivalPort').get('name')}</span>
          </div>
          <div style={this.style('shipInfoRight')}>
            {etaTimeEle}
            {etdTimeEle}
            <span style={this.style('shipInfoRightSpanTime')}>{moment(new Date()).format('YYYY/MM/DD')}</span>
          </div>
        </div>
        {this.renderPriceTotal(costItems)}
      </div>
    );
  },

  renderPriceTotal(costItems) {
    return (
      <div style={this.style('price')}>
        <span style={this.style('priceTotal')}>{this.t('nTitlePriceTotal')}</span>
        <span style={this.style('priceNumber')}>{'$'+ this._calculatePrice(costItems)}</span>
      </div>
    );
  },

  renderCostItemByProduct(costItemProduct, tableIndex) {
    let costItems = costItemProduct.costItems;
    let product = costItemProduct.product;
    let tableRows = [];
    let colStyle = Object.assign({}, this.style('col'), {borderBottom:'none'})
    tableRows.push(
      <TableRow
        key={'row_'+product._id}
        style={colStyle}
        displayRowCheckbox={false}
      >
        <TableRowColumn
           colSpan="13"
           key={'product_' + product._id}
           style={this.style('productName')}
        >
          {product.name}
        </TableRowColumn>
        <TableRowColumn
          colSpan="3"
           key={'product_price_' + product._id}
           style={this.style('productPrice')}
        >
          {this._calculatePrice(costItems)}
        </TableRowColumn>
      </TableRow>
    );

    _.forEach(costItems, (costItem, index) => {
      let rowCols = [];
      let id = costItem._id + '_' + product._id;
      rowCols.push(
        <TableRowColumn
          key={'col_number_' + id}
          style={this.style('colName')}
        >
          {tableIndex + '-' + (index + 1)}
        </TableRowColumn>
      );
      rowCols.push(
        <TableRowColumn
          key={'col_name_' + id}
          colSpan="6"
          style={this.style('colName')}
        >
          {costItem.costType.code === 'CTOTHERS' ? costItem.subName : costItem.costType.name}
        </TableRowColumn>
      );
      rowCols.push(
        <TableRowColumn
          colSpan="6"
          key={'col_note_'+id}
          style={this.style('colName')}
        >
          {costItem.note}
        </TableRowColumn>
      );
      rowCols.push(
        <TableRowColumn
          colSpan="3"
           key={'col_amount_'+id}
           style={this.style('col')}
        >
          {this._parseValueToFixed(costItem.amount, TO_FIXED_LEN)}
        </TableRowColumn>
      );
      tableRows.push(
        <TableRow
          key={'row_' + id}
          style={this.style('col')}
          displayRowCheckbox={false}
        >
          {rowCols}
        </TableRow>
      );
    });

    return tableRows;
  },

  renderCostItems(costItems) {
    let theme = this.getTheme();
    let tableRows = [];
    let isEstimated = this.props.isEstimated;
    let costItemsByProduct = this._getCostItemsByProduct(costItems);
    _.forEach(costItemsByProduct, (costItemProduct, index) => {
      tableRows = tableRows.concat(this.renderCostItemByProduct(costItemProduct, index + 1));
    });

    return (
       <Table
         ref={'table'}
         style={this.style('tableStyle')}
         fixedHeader={false}
         height='500px'
       >
         <TableHeader
           key='table_header'
           displaySelectAll={false}
           adjustForCheckbox={false}
           selectAllSelected={false}
         >
           <TableRow key = 'display_header'>
             <TableHeaderColumn
               key='header_number'
               style={this.style('colName')}
             >
                {this.t('nLabelNumber')}
             </TableHeaderColumn>
             <TableHeaderColumn
               colSpan= "6"
               key='header_name'
               style={this.style('colName')}
             >
                {this.t('nLabelCostTypeName')}
             </TableHeaderColumn>
             <TableHeaderColumn
               colSpan="6"
               key='header_note'
               style={this.style('colName')}
             >
                {this.t('nLabelNote')}
             </TableHeaderColumn>
             <TableHeaderColumn
               colSpan="3"
               key='header_amount'
               style={this.style('col')}
             >
                {isEstimated ? this.t('nLabelAmountEst'):this.t('nLabelAmountAct')}
             </TableHeaderColumn>
           </TableRow>
         </TableHeader>
         <TableBody
           displayRowCheckbox={false}
           showRowHover={false}
           deselectOnClickaway= {false}
           allRowsSelected={false}
         >
          {tableRows}
         </TableBody>
       </Table>
    );
  },

  render() {
    let costItems = this._getCostItems();

    return (
      <div style={this.style('costType')}>
        {this.renderTitle(costItems)}
        {this.renderCostItems(costItems)}
      </div>
    );
  },

  _parseValueToFixed(value, length) {
    let v = parseFloat(value);
    return v ? v.toFixed(length) : value;
  },

  _getCostItems() {
    let isEstimated = this.props.isEstimated;
    let costItems = [];
    let order = this.props.order.toJS();
    let orderEntries = order.orderEntries;
    orderEntries = _.filter(orderEntries, entry => entry.status != ORDER_ENTRY_STATUS.CANCELLED);
    _.forEach(orderEntries, orderEntry => {
      costItems = costItems.concat(isEstimated ? orderEntry.costItemsEstimated : orderEntry.costItems);
    });

    return costItems;
  },

  _calculatePrice(costItems) {
    return this._parseValueToFixed(_.reduce(costItems, (total, item) => {
      return total + parseFloat(item.amount);
    }, 0), TO_FIXED_LEN);
  },

  _displayDate(dateString) {
    return moment(new Date(dateString)).format('YYYY/MM/DD h:mm');
  },

  _getCostItemsByProduct(costItems) {
    let costItemsByProduct = [];
    let costTypes = this.props.costTypes.toJS();
    let products = this.props.products.toJS();
    _.forEach(costItems, costItem => {
      costItem.costType = _.find(costTypes, ct => {
        return ct._id == costItem.costType;
      });
      let product = _.find(products, pt => {
        return pt._id == costItem.product;
      });
      let contains = false;
      _.forEach(costItemsByProduct, ci => {
        if (ci.product._id === product._id) {
          contains = true;
          ci.costItems.push(costItem);
        }
      });
      if (!contains) {
        costItemsByProduct.push({
          product: product,
          costItems: [costItem],
        });
      }
    });

    return costItemsByProduct;
  },
});

module.exports = PriceTableView;
