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
const Paper = require('epui-md/Paper');
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
const CT_CODE_OTHERS = 'CTOTHERS';
const TO_FIXED_LEN = 2;

const COSTTYPES = require('./costTypes');

const PriceTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    costItems: PropTypes.array,
    isEditable: PropTypes.bool,
    isEstimated: PropTypes.bool,
    nLabelAmountAct: PropTypes.string,
    nLabelAmountEcr: PropTypes.string,
    nLabelAmountEst: PropTypes.string,
    nLabelChooseCostType: PropTypes.string,
    nLabelClickToEdit: PropTypes.string,
    nLabelCostTypeName: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nLabelErrorTextAmount: PropTypes.string,
    nLabelErrorTextItemName: PropTypes.string,
    nLabelErrorTextItemSubName: PropTypes.string,
    nLabelInvoice: PropTypes.string,
    nLabelNote: PropTypes.string,
    nLabelNumber: PropTypes.string,
    nTextAddChargeFee: PropTypes.string,
    nTextRemove: PropTypes.string,
    nTextSave: PropTypes.string,
    onAddCostType: PropTypes.func,
    onRemoveCostType: PropTypes.func,
    product: PropTypes.object,
    productConfig: PropTypes.object,
    tableIndex: PropTypes.number,
    exchange: PropTypes.number,
    hasLumpsum: PropTypes.bool,
    costItemsEstimated: PropTypes.array,
  },

  getDefaultProps() {
    return {
      costItems: [],
      product: {},
      tableIndex: 1,
    };
  },

  getInitialState() {
    return {
      editMode: false,
      selectedRows: [],
      allRowsSelected: true,
      costItems: this.props.costItems,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.costItems) {
      this.setState({
        costItems: nextProps.costItems,
      });
    }
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let fontSize = 13;
    let theme = this.getTheme();

    return {
      root:{
        border: '1px solid #DCDCDC',
        padding: padding * 5,
        marginBottom: padding * 5,
        minHeight: 16,
      },
      title: {
        fontSize: 15,
        textAlign: 'left',
        paddingBottom: padding * 4,
        marginTop: padding * 15,
        marginBottom: padding * 4,
        color: '#4a4a4a',
        borderBottom: 'none'
      },
      tableStyle: {
        position: 'relative',
        backgroundColor: 'transparent',
        textAlign: 'center',
        border: '1px solid #DCDCDC',
        borderTop: 'none',
        width: '100%',
      },
      textField: {
        width: 'initial',
        textAlign: 'right',
      },
      textFieldNote: {
        width: 230,
        textAlign: 'left',
      },
      underlineStyle: {
        display: 'none'
      },
      hintStyle: {
        width: '100%',
        fontSize: fontSize,
      },
      inputStyle: {
        fontSize: fontSize,
        textOverflow: 'ellipsis',
        textAlign: 'right'
      },
      inputNoteStyle: {
        fontSize: fontSize,
        textOverflow: 'ellipsis',
        textAlign: 'left'
      },
      costType: {},
      col: {
        textAlign: 'right',
        paddingLeft: 0,
        paddingRight: 20,
        color: '#4a4a4a',
        fontSize: 13,
      },
      colNote: {
        textAlign: 'left',
        paddingLeft: 0,
        paddingRight: 10,
        color: '#4a4a4a',
        fontSize: 13,
        width: 220,
        whiteSpace: 'pre-line',
      },
      colEqual: {
        textAlign: 'right',
        paddingLeft: 0,
        paddingRight: 10,
        width:'20px',
      },
      colName: {
        textAlign: 'left',
        width: 200,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#4a4a4a',
        fontSize: 13,
      },
      toolBar: {
        border: '1px solid #e0e0e0',
      },
      toolBarBtn: {
        fill: '#fff'
      },
      remove: {
        width: '50%',
        height: 64,
        lineHeight: '64px',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      removeLabel:{
        fontSize: 16,
        textTransform: 'uppercase',
        color: this.state.selectedRows && this.state.selectedRows.length === 0 ? '#b3b3b3' : '#f5a623',
      },
      removeBtn: {
        backgroundColor: 'transparent',
        marginLeft: padding * 4,
        minWidth: 'none'
      },
      tool: {
        width: '50%',
        textAlign: 'right',
        display: 'inline-block',
        verticalAlign: 'middle'
      },
      toolBtn: {
        textAlign: 'right',
        paddingRight: 0
      },
      menu: {
        maxHeight: 300
      },
      menuStyle: {
        textAlign: 'left'
      },
      addChargeFee: {
        border: '1px solid #e0e0e0',
        borderTop: 'none',
        height: 56,
        lineHeight: '56px',
      },
      addBtn: {
        verticalAlign: 'middle',
        fill: '#f5a623',
        width: 18,
        height: 18,
      },
      addBtnLabel: {
        display: 'inline-block',
        marginLeft: padding * 3,
        verticalAlign: 'middle',
        color: '#f5a623',
        fontSize: 14,
        fontWeight: 500,
      },
      addChargeBtn: {
        display: 'inline-block',
        padding: '0px 23px',
        cursor: 'pointer'
      },
      menuUnderlineStyle: {
        borderBottom: 'none'
      },
      menuLabelStyle: {
        fontSize: fontSize,
        top: '2px',
      },
      selectHintStyle: {
        fontSize: fontSize,
        bottom: 18
      },
      headerName:{
        fontWeight: 500,
        textTransform: 'uppercase',
      }
    };
  },

  validatePrice() {
    let validate = true;
    let costItems = this.state.costItems;

    _.forEach(costItems, item => {
      let id = item.id || item._id;
      if (item.isAdd && this.refs['text_field_amount_' + id] && !Number(this.refs['text_field_amount_' + id].getValue())) {
        validate = false;
        item.errorTextAmount = this.t('nLabelErrorTextAmount');
      }
      if (item.isAdd && this.refs['text_field_amountRMB_' + id] && !Number(this.refs['text_field_amountRMB_' + id].getValue())) {
        validate = false;
        item.errorTextAmountRMB = this.t('nLabelErrorTextAmount');
      }
      if (item.isAdd && this.refs['text_field_subName_' + id] && !this.refs['text_field_subName_' + id].getValue()) {
        validate = false;
        item.errorTextItemSubName = this.t('nLabelErrorTextItemSubName');
      }
      if (item.isAdd && this.refs['select_field_' + id] && !item.costType) {
        validate = false;
        item.errorTextItemName = this.t('nLabelErrorTextItemName');
      }
    });
    if (!validate) {
      this.setState({
        costItems: costItems,
      });
    }

    return validate;
  },

  getCostItemAdded() {
    let costItems = this.state.costItems;
    let exchange = this.props.exchange;
    let costItemsAdded = [];

    _.forEach(costItems, item => {
      let id = item.id || item._id;
      if (item.isAdd) {
        if (this.refs['text_field_amount_' + id]) {
          item.amount = this.refs['text_field_amount_' + id].getValue();
        }
        if (this.refs['text_field_amountRMB_' + id]) {
          item.amountRMB = this.refs['text_field_amountRMB_' + id].getValue();
          item.amount = item.amountRMB / exchange;
        }
        if (this.refs['text_field_note_' + id]) {
          item.note = this.refs['text_field_note_' + id].getValue();
        }
        if (this.refs['text_field_subName_' + id]) {
          item.subName = this.refs['text_field_subName_' + id].getValue();
        }
      }
      if (item.costType) {
        costItemsAdded.push(item);
      }
    });

    return costItemsAdded;
  },

  renderTitle() {
    return(
      <div
        key={'title_' + this.props.product.code}
        style={this.style('title')}
      >
        {this.props.product.name}
      </div>
    );
  },

  renderToolBar() {
    return(
      <div style={this.style('toolBar')}>
        <div style={this.style('remove')}>
          <FlatButton
            disabled={this.state.selectedRows.length === 0}
            label={this.t('nTextRemove')}
            labelStyle={this.style('removeLabel')}
            onClick={this._handleRemoveSelection}
            style={this.style('removeBtn')}
          />
        </div>
      </div>
    );
  },

  renderSelectMenu(id, value, errorText) {
    let {
      menuItems,
      selectedValue,
    } = this._getMenuItems(value);

    let items = _.reduce(menuItems, (result, value, key) => {
      result.push(
        <MenuItem
          key={key}
          value={value.payload}
          primaryText={value.text}
        />
      );

      return result;
    }, []);

    return (
      <SelectField
        ref={'select_field_' + id}
        key={'select_field_' + id}
        displayUnderlineStyle={this.style('underlineStyle')}
        errorText={errorText}
        hintStyle={this.style('selectHintStyle')}
        hintText={this.t('nLabelChooseCostType')}
        labelStyle={this.style('menuLabelStyle')}
        maxHeight={300}
        onChange={this._handleSelectFieldChange.bind(this, id)}
        underlineStyle={this.style('menuUnderlineStyle')}
        value={selectedValue}
        autoWidth={true}
      >
        {items}
      </SelectField>
    );
  },

  renderEditTextField(id, value, parseToNumber, errorText, inputStyle) {
    return(
      <TextField
       ref={id}
       key={id}
       defaultValue={value ? value: ''}
       errorText={errorText}
       hintStyle={this.style('hintStyle')}
       hintText={this.t('nLabelClickToEdit')}
       inputStyle={inputStyle || errorText === true ? this.style('inputNoteStyle') : this.style('inputStyle')}
       onBlur={this._handleBlur.bind(this, id, parseToNumber)}
       onChange={this._handleChange}
       style={errorText === true ? this.style('textFieldNote') : this.style('textField')}
       underlineStyle={this.style('underlineStyle')}
      />
    );
  },

  renderRMBEditTextField(id, value, parseToNumber, errorText, itemID, inputStyle) {
    return(
      <TextField
       ref={id}
       key={id}
       defaultValue={value ? value: ''}
       errorText={errorText}
       hintStyle={this.style('hintStyle')}
       hintText={this.t('nLabelClickToEdit')}
       inputStyle={inputStyle || this.style('inputStyle')}
       onBlur={this._handleBlur.bind(this, id, parseToNumber)}
       onChange={this._handleCostItemChange.bind(this, itemID)}
       style={this.style('textField')}
       underlineStyle={this.style('underlineStyle')}
      />
    );
  },

  renderCostItems() {
    let theme = this.getTheme();
    let costItems = this.state.costItems;
    let editable = this.props.isEditable;
    let product = this.props.product;
    let productCode = product && product.code;

    let tableRows = [];

    _.forEach(costItems, (costItem, index) => {
      let isAdd = costItem.isAdd ? true : false;
      let rowCols = [];
      let id = costItem.id || costItem._id;
      let code = costItem.costType && costItem.costType.code;
      let amountRMBedit = _.includes(COSTTYPES.USUAL, code) || COSTTYPES[code] &&  _.includes(COSTTYPES[code], productCode);

      rowCols.push(
        <TableRowColumn
         key={'col_name_' + id}
         style={this.style('colName')}
        >
           {isAdd && editable ? code === 'CTOTHERS' ? this.renderEditTextField('text_field_subName_' + id, costItem.subName || 'Others', false, costItem.errorTextItemSubName, _.assign({}, this.style('inputStyle'), {textAlign: 'left'})) : this.renderSelectMenu(id, costItem.costType, costItem.errorTextItemName) : (code === 'CTOTHERS' ? costItem.subName: costItem.costType.name)}
        </TableRowColumn>
      );

      rowCols.push(
        <TableRowColumn
          key={'col_note_' + id}
          style={this.style('colNote')}
        >
        { isAdd && editable ? costItem.description && costItem.description.length > 0 ? <div style={this.style('textFieldNote')}>{costItem.description}</div> : this.renderEditTextField('text_field_note_' + id, costItem.note, false, true) : costItem.description && costItem.description.length > 0 ? <div style={this.style('textFieldNote')}>{costItem.description}</div> : costItem.note }
        </TableRowColumn>
      );

      rowCols.push(
        <TableRowColumn
         key={'col_amountRMB_' + id}
         style={this.style('col')}
        >
          {isAdd && editable && amountRMBedit ?
            this.renderRMBEditTextField('text_field_amountRMB_' + id, this._parseValueToFixed(costItem.amountRMB, TO_FIXED_LEN), true, costItem.errorTextAmountRMB, id):
            this._parseValueToFixed(costItem.amountRMB, TO_FIXED_LEN) || ''}
        </TableRowColumn>
      );
      rowCols.push(
        <TableRowColumn
         key={'col_equal_' + id}
         style={this.style('colEqual')}
        />
      );
      rowCols.push(
        <TableRowColumn
         key={'col_amount_' + id}
         style={this.style('col')}
        >
          {isAdd && editable && !amountRMBedit ?
            this.renderEditTextField('text_field_amount_' + id, this._parseValueToFixed(costItem.amount, TO_FIXED_LEN), true, costItem.errorTextAmount):
            this._parseValueToFixed(costItem.amount, TO_FIXED_LEN)}
        </TableRowColumn>
      );

      tableRows.push(
        <TableRow
          key={'row_' + id}
          style={this.style('col')}
          displayRowCheckbox={isAdd}
          selected={_.includes(this.state.selectedRows, index)}
        >
          {rowCols}
        </TableRow>
      );
    });

    return (
       <Table
         ref={'table_' + this.props.product.code}
         style={this.style('tableStyle')}
         multiSelectable={editable}
         onRowSelection ={this._handleRowSelection}
       >
         <TableHeader
           key={'table_header' + this.props.product.code}
           displaySelectAll={editable}
           adjustForCheckbox={editable}
           selectAllSelected={editable}
         >
           <TableRow key='display_header'>
             <TableHeaderColumn
               key='header_name'
               style={this.style('colName','headerName')}
             >
                {this.t('nLabelCostTypeName')}
             </TableHeaderColumn>
             <TableHeaderColumn
               key='header_note'
               style={this.style('colNote','headerName')}
             >
                {this.t('nLabelNote')}
             </TableHeaderColumn>
             <TableHeaderColumn
               key='header_amountRMB'
               style={this.style('col','headerName')}
             >
                {this.props.isEstimated ? this.t('nLabelAmountEstRMB') : this.t('nLabelAmountActRMB')}
             </TableHeaderColumn>
             <TableHeaderColumn
               key='header_amountRMB'
               style={this.style('colEqual','headerName')}
             >
             =
             </TableHeaderColumn>
             <TableHeaderColumn
               key='header_amount'
               style={this.style('col','headerName')}
             >
                {this.props.isEstimated ? this.t('nLabelAmountEst') : this.t('nLabelAmountAct')}
             </TableHeaderColumn>
           </TableRow>
         </TableHeader>
         <TableBody
           displayRowCheckbox={editable}
           showRowHover={editable}
           deselectOnClickaway={editable}
           allRowsSelected={this.state.allRowsSelected}
         >
           {tableRows}
         </TableBody>
       </Table>
    );
  },

  renderAddChargeFee() {
    return(
      <div style={this.style('addChargeFee')}>
        <div
          style={this.style('addChargeBtn')}
          onClick={this._handleAddChargeFee}
        >
          <AddButton style={this.style('addBtn')} />
          <span style={this.style('addBtnLabel')}>{this.t('nTextAddChargeFee')}</span>
        </div>
      </div>
    );
  },

  render() {
    let editable = this.props.isEditable;

    return (
      <div style={this.style('costType')}>
        {this.renderTitle()}
        <Paper zDepth={1}>
          {editable ? this.renderToolBar() : null}
          {this.renderCostItems()}
          {editable ? this.renderAddChargeFee() : null}
        </Paper>
      </div>
    );
  },

  _getMenuItems(costTypeId) {
    if(costTypeId) {
      costTypeId = _.isString(costTypeId) ? costTypeId : costTypeId._id;
    }
    let costItems = this.state.costItems;
    let selectedValue = costTypeId ? costTypeId : null;
    let menuItems = [];
    if(this.props.product) {
      let costTypes = this.props.product.costTypes;
      if(this.props.hasLumpsum){
        menuItems.push({
          payload: '5820368177c8c34410097926',
          text: 'Lump sum',
        });
        menuItems.push({
          payload: '56651b9c5b4f53742b804e73',
          text: 'Others',
        });
      }else {
        _.forEach(costTypes, (costType, index) => {
          if(!_.isString(costType.costType)) {
            menuItems.push({
              payload: costType.costType._id,
              text: costType.costType.name,
            });
          }
        });

        if(this.props.product.code === 'PTCPD'){
          menuItems.pop();
        }
      }
    }

    return {menuItems, selectedValue};
  },

  _handleRowSelection(selectedRows) {
    if(_.isString(selectedRows)) {
      if(selectedRows === 'all') {
        selectedRows = [];
        _.forEach(this.state.costItems, (item,index) => {
          if(item.isAdd) selectedRows.push(index);
        });
      } else {
        selectedRows = [];
      }
    }

    this.setState({
      selectedRows: selectedRows,
    });
  },

  _handleBlur(key, parseToNumber) {
    //TODO: convert fixed value
    // if(parseToNumber) this.refs[key].setValue(this._parseValueToFixed(this.refs[key].getValue(), TO_FIXED_LEN));
  },

  _parseValueToFixed(value, length) {
    let v = parseFloat(value);
    return v ? v.toFixed(length) : value;
  },

  _handleAddChargeFee() {
    if (!global.isOrderDetailsChanged()) {
      global.notifyOrderDetailsChange(true, () => {
        this._addChargeFee();
      });
    } else {
      this._addChargeFee();
    }
  },

  _addChargeFee() {
    let {
      costItems,
      selectedRows,
    } = this.state;
    let { product } = this.props;
    let costType = null;
    if (product) {
      let costTypes = product.costTypes;
      costType = costTypes[0].costType._id;
    }
    let costItemEst = {
      id: Math.random() * 10001,
      amount: 0,
      amountRMB: 0,
      product: this.props.product._id,
      variables: {},
      isAdd: true,
    };
    costItems.push(costItemEst);

    if (this.refs['table_' + this.props.product.code] && this.refs['table_' + this.props.product.code].isAllRowsSelected()) {
      selectedRows.push(costItems.length - 1);
    }

    this.setState({
      costItems: costItems,
      selectedRows: selectedRows,
    });
  },

  _handleRemoveSelection() {
    if(!global.isOrderDetailsChanged()) {
      global.notifyOrderDetailsChange(true, () => { this._removeSelection() });
    } else {
      this._removeSelection();
    }
  },

  _removeSelection() {
    let selectedRows = this.state.selectedRows;
    let costItems = this.state.costItems;
    _.remove(costItems, (item, index) => {
      return _.includes(selectedRows, index);
    });

    this.setState({
      allRowsSelected: false,
      costItems: costItems,
      selectedRows: [],
    });
  },

  _handleSelectFieldChange(id, e, index, value) {
    this._handleChange();
    if (this.props.product) {
      let costTypes = this.props.product.costTypes;
      let costType = null;

      _.forEach(costTypes, ct => {
        if (!_.isString(ct.costType) && ct.costType._id === value) {
          costType = ct.costType;
        }
      });

      if (costType) {
        let costItems = this.state.costItems;
        _.forEach(costItems, item => {
          let itemId = item.id || item._id;
          if (itemId === id) {
            item.costType = costType;
            item.errorTextItemName = null;
          }
        });

        this.setState({
          costItems: costItems,
        });
      }
    }
  },

  _handleCostItemChange(id, e, value) {
    let fn = () => {
      let { exchange } = this.props;
      let { costItems } = this.state;
      _.forEach(costItems, costItem => {
        if(costItem.id === id || costItem._id === id){
          costItem.amount = value / exchange;
        }
      })
      this.setState({
        costItems:costItems,
      })
    };
    if (!global.isOrderDetailsChanged()) {
      global.notifyOrderDetailsChange(true, fn);
    }else {
      fn();
    }
  },

  _handleChange(fn) {
    if (!global.isOrderDetailsChanged()) {
      global.notifyOrderDetailsChange(true);
    }
  },
});

module.exports = PriceTable;
