const React = require('react');
const AutoStyle = require('epui/lib/mixins/auto-style');
const Translatable = require('epintl');
const TextField = require('epui/lib/text-field');
const SelectField = require('epui/lib/select-field');
const FlatButton = require('epui/lib/flat-button');
const Table = require('epui/lib/ep-table/table');
const TableBody = require('epui/lib/ep-table/table-body');
const TableHeader = require('epui/lib/ep-table/table-header');
const TableHeaderColumn = require('epui/lib/ep-table/table-header-column');
const TableRow = require('epui/lib/ep-table/table-row');
const TableRowColumn = require('epui/lib/ep-table/table-row-column');
const AddButton = require('epui/lib/svg-icons/content/add');
const RemoveButton = require('epui/lib/svg-icons/content/remove');
const ClearButton = require('epui/lib/svg-icons/content/clear');
const IconMenu = require('epui/lib/menus/icon-menu');
const MenuItem = require('epui/lib/menus/menu-item');
const MoreVertIcon = require('epui/lib/svg-icons/navigation/more-vert');
const IconButton = require('epui/lib/icon-button');
const DivButton = require('./div-button');
const PureRenderMixin = React.addons.PureRenderMixin;
const TO_FIXED_LEN = 2;
const CT_CODE_OTHERS = 'CTOTHERS';

const PropTypes = React.PropTypes;

let PriceTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epintl/dist/PriceConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    isEstimated: PropTypes.bool,
    isEditable: PropTypes.bool,
    product : PropTypes.object,
    costItems: PropTypes.array,
    tableIndex: PropTypes.number,
    nLabelEdit: PropTypes.string,
    nTextRemove: PropTypes.string,
    nLabelCostTypeName: PropTypes.string,
    nLabelAmountEst: PropTypes.string,
    nLabelAmountAct: PropTypes.string,
    nLabelAmountEcr: PropTypes.string,
    nLabelInvoice: PropTypes.string,
    nLabelNote: PropTypes.string,
    nLabelNumber: PropTypes.string,
    nLabelClickToEdit: PropTypes.string,
    nTextAddChargeFee: PropTypes.string,
    nLabelChooseCostType: PropTypes.string,
    nLabelErrorTextAmount: PropTypes.string,
    nLabelErrorTextAmountNotAllowdZero: PropTypes.string,
    nLabelErrorTextItemName: PropTypes.string,
    nTextSave:PropTypes.string,
    onAddCostType:PropTypes.func,
    onRemoveCostType:PropTypes.func,
  },

  getDefaultProps() {
    return {
      product: {},
      costItems : [],
      tableIndex: 1,
    };
  },

  getInitialState: function() {
    return {
      editMode: false,
      selectedRows: [],
      allRowsSelected: true,
      costItems: this.props.costItems,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let fontSize =13;
    let theme = this.getTheme();
    return {
      root:{
        border: '1px solid #DCDCDC',
        padding: padding*5,
        marginBottom: padding*5,
        minHeight: 16,
      },
      title:{
        fontSize: 15,
        fontWeight: 500,
        textAlign: 'left',
        paddingBottom: padding*4,
        color: theme.primary1Color,
        marginTop: padding*12,
        borderBottom: 'none',
      },
      tableStyle:{
        backgroundColor: 'transparent',
        textAlign: 'center',
        border: '1px solid #DCDCDC',
        width: '100%',
      },
      textField:{
        width: 'initial',
      },
      underlineStyle:{
        display:'none',
      },
      hintStyle:{
        width: '100%',
        fontSize:fontSize,
      },
      inputStyle:{
        fontSize: fontSize,
        textOverflow: 'ellipsis',
        textAlign: 'right',
      },
      costType:{
        //marginBottom: padding*5,
      },
      col:{
         textAlign:'right',
         paddingLeft: 0,
         paddingRight: 10,
      },
      colName:{
         textAlign:'left',
         width: 200,
         paddingLeft: 10,
         paddingRight: 10,
      },
      toolBar:{
        border: '1px solid #e0e0e0',
        borderBottom: 'none',
      },
      toolBarBtn:{
        fill: '#fff',
      },
      remove:{
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      removeBtn:{
        backgroundColor: 'transparent',
        marginLeft: padding*4,
        minWidth: 'none',
      },
      tool:{
        width: '50%',
        textAlign: 'right',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      toolBtn:{
        textAlign: 'right',
        paddingRight: 0,
      },
      menu:{
        maxHeight: 300,
      },
      menuStyle:{
        textAlign: 'left',
      },
      addChargeFee:{
        border: '1px solid #e0e0e0',
        borderTop: 'none',
      },
      addBtn:{
        verticalAlign: 'middle',
        fill: theme.primary1Color,
      },
      addBtnLabel:{
        display: 'inline-block',
        marginLeft: padding*3,
        verticalAlign: 'middle',
        color: theme.primary1Color,
      },
      addChargeBtn:{
        display: 'inline-block',
        padding: '10px 23px',
        cursor: 'pointer',
      },
      menuUnderlineStyle:{
        borderBottom: 'none',
      },
      menuLabelStyle:{
        fontSize:fontSize,
      },
      selectHintStyle:{
        fontSize:fontSize,
        bottom: 12,
      },
    };
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.costItems){
      this.setState({costItems: nextProps.costItems});
    }
  },

  validatePrice(){
    let validate =true;
    let costItems= this.state.costItems;
    _.forEach(costItems,item=>{
      let id = item.id ||item._id;
        if(item.isAdd && this.refs['text_field_amount_'+id]){
          if(!this.refs['text_field_amount_'+id].getValue()){
            validate =false;
            item.errorTextAmount = this.t('nLabelErrorTextAmount');
          }else if (this.refs['text_field_amount_'+id].getValue()==0){
            validate =false;
            item.errorTextAmount = this.t('nLabelErrorTextAmountNotAllowdZero');
          }
        }
        if(item.isAdd &&
          this.refs['select_field_'+id] &&
          !this.refs['select_field_'+id].getValue()){
          validate =false;
          item.errorTextItemName = this.t('nLabelErrorTextItemName');
        }
    });
    if(!validate){
      this.setState({costItems:costItems});
    }
    return validate;
  },

  getCostItemAdded(){
    let costItems= this.state.costItems;
    let costItemsAdded =[];
    _.forEach(costItems,item=>{
      let id = item.id ||item._id;
      if(item.isAdd){
        if(this.refs['select_field_'+id]){
          item.costType = this.refs['select_field_'+id].getValue();
        }
        if(this.refs['text_field_amount_'+id]){
          item.amount = this.refs['text_field_amount_'+id].getValue();
        }
        if(this.refs['text_field_note_'+id]){
          item.note = this.refs['text_field_note_'+id].getValue();
        }
      }
      if(item.costType){
        costItemsAdded.push(item);
      }
    });
    return costItemsAdded;
  },

  renderTitle(){
    return(
      <div
        key = {'title_'+this.props.product.code}
        style = {this.style('title')}
      >
        {this.props.product.name}
      </div>
    );
  },

  renderToolBar(){
    return(
      <div style ={this.style('toolBar')}>
        <div style = {this.style('remove')}>
          <FlatButton
            style = {this.style('removeBtn')}
            secondary = {true}
            label = {this.t('nTextRemove')}
            onClick = {this._handleRemoveSelection}
            disabled = {this.state.selectedRows.length===0}
          />
        </div>
      </div>
    );
  },

  renderSelectMenu(id,value,errorText){
    let {menuItems,selectedValue}= this._getMenuItems(value);
    return (
      <SelectField
        ref = {'select_field_'+id}
        key = {'select_field_'+id}
        menuItems = {menuItems}
        value = {selectedValue}
        hintText ={this.t('nLabelChooseCostType')}
        errorText = {errorText}
        maxHeight = {300}
        hintStyle={this.style('selectHintStyle')}
        labelStyle={this.style('menuLabelStyle')}
        displayUnderlineStyle={this.style('underlineStyle')}
        underlineStyle = {this.style('menuUnderlineStyle')}
        onSelectValueChange = {this._handleSelectFieldChange.bind(this,id)}
      >
      </SelectField>
    );
  },

  renderEditTextField(id,value,parseToNumber,errorText){
    return(
      <TextField
       ref = {id}
       key = {id}
       style = {this.style('textField')}
       defaultValue = {value? value: ''}
       hintText={this.t('nLabelClickToEdit')}
       errorText = {errorText}
       hintStyle={this.style('hintStyle')}
       inputStyle = {this.style('inputStyle')}
       underlineStyle = {this.style('underlineStyle')}
       onBlur = {this._handleBlur.bind(this,id,parseToNumber)}
       onChange = {this._handleChange}
      />
    );
  },

  renderCostItems(){
    let theme = this.getTheme();
    let editable = this.props.isEditable;
    let tableRows =[];
    let costItems = this.state.costItems;
    _.forEach(costItems,(costItem,index)=>{
      let isAdd = costItem.isAdd ? true: false;
      let rowCols =[];
      let id = costItem.id || costItem._id;
      rowCols.push(
        <TableRowColumn
           key = {'col_name_'+id}
           style = {this.style('colName')}
        >
           {isAdd && editable ? this.renderSelectMenu(id,costItem.costType,costItem.errorTextItemName):costItem.costType.name}
        </TableRowColumn>
      );
      rowCols.push(
        <TableRowColumn
          key = {'col_note_'+id}
          style = {this.style('col')}
        >
        { isAdd && editable ? this.renderEditTextField('text_field_note_'+id,costItem.note,false) : costItem.note}
        </TableRowColumn>
      );
      rowCols.push(
        <TableRowColumn
           key = {'col_amount_'+id}
           style = {this.style('col')}
        >
          {isAdd && editable ?
            this.renderEditTextField('text_field_amount_'+id,this._parseValueToFixed(costItem.amount,TO_FIXED_LEN),true,costItem.errorTextAmount):
            this._parseValueToFixed(costItem.amount,TO_FIXED_LEN)}
        </TableRowColumn>
      );
      // rowCols.push(
      //   <TableRowColumn
      //     key = {'col_number_'+id}
      //     style = {this.style('col')}
      //   >
      //     {this.props.tableIndex+'-'+(index+1)}
      //   </TableRowColumn>
      // );
      tableRows.push(
        <TableRow
          key = {'row_'+id}
          style = {this.style('col')}
          displayRowCheckbox = {isAdd}
          selected = {_.includes(this.state.selectedRows,index)}
        >
          {rowCols}
        </TableRow>
      );
    });
    return (
       <Table
         ref= {'table_'+this.props.product.code}
         style={this.style('tableStyle')}
         multiSelectable={editable}
         onRowSelection ={this._handleRowSelection}
       >
         <TableHeader
           key = {'table_header'+this.props.product.code}
           displaySelectAll={editable}
           adjustForCheckbox={editable}
           selectAllSelected={editable}
         >
           <TableRow key = 'display_header'>
             <TableHeaderColumn
               key = 'header_name'
               style = {this.style('colName')}
             >
                {this.t('nLabelCostTypeName')}
             </TableHeaderColumn>
             <TableHeaderColumn
               key = 'header_note'
               style = {this.style('col')}
             >
                {this.t('nLabelNote')}
             </TableHeaderColumn>
             <TableHeaderColumn
               key = 'header_amount'
               style = {this.style('col')}
             >
                {this.props.isEstimated ? this.t('nLabelAmountEst'):this.t('nLabelAmountAct')}
             </TableHeaderColumn>
           </TableRow>
         </TableHeader>
         <TableBody
           displayRowCheckbox={editable}
           showRowHover={editable}
           deselectOnClickaway= {editable}
           allRowsSelected={this.state.allRowsSelected}
         >
           {tableRows}
         </TableBody>
       </Table>
    );
  },

  // <TableHeaderColumn
  //   key = 'header_number'
  //   style = {this.style('col')}
  // >
  //    {this.t('nLabelNumber')}
  // </TableHeaderColumn>

  renderAddChargeFee(){
    return(
      <div style = {this.style('addChargeFee')}>
        <div
          style = {this.style('addChargeBtn')}
          onClick = {this._handleAddChargeFee}
        >
          <AddButton style = {this.style('addBtn')}/>
          <span style = {this.style('addBtnLabel')}>{this.t('nTextAddChargeFee')}</span>
        </div>
      </div>
    );
  },

  render() {
    let editable = this.props.isEditable;
    return(
      <div style = {this.style('costType')}>
        {this.renderTitle()}
        {editable ? this.renderToolBar() :null}
        {this.renderCostItems()}
        {editable ? this.renderAddChargeFee():null}
      </div>
    );
  },

  _getMenuItems(costTypeId){
    if(costTypeId){
      costTypeId =_.isString(costTypeId) ? costTypeId : costTypeId._id;
    }
    let costItems = this.state.costItems;
    let selectedValue = costTypeId ? costTypeId :null;
    let menuItems =[];
    if(this.props.product){
      let costTypes = this.props.product.costTypes;
      _.forEach(costTypes,(costType,index)=>{
        if(!_.isString(costType.costType)){
          menuItems.push({
            payload: costType.costType._id,
            text:costType.costType.name
          });
          // let contains =false;
          // _.forEach(costItems,item=>{
          //   if(item.costType && item.costType.code ===costType.costType.code && item.costType.code!==CT_CODE_OTHERS){
          //     contains = true;
          //   }
          //   if(costTypeId && costType.costType._id === costTypeId){
          //     contains = false;
          //   }
          // });
          // if(!contains){
          //   menuItems.push({
          //     payload: costType.costType._id,
          //     text:costType.costType.name
          //   });
          // }
        }
      });
    }
    if(!selectedValue && menuItems.length ===1){
      selectedValue=menuItems[0].payload;
    }
    return {menuItems,selectedValue};
  },

  _handleRowSelection(selectedRows){
    if(_.isString(selectedRows)){
      if(selectedRows ==='all'){
        selectedRows=[];
        _.forEach(this.state.costItems,(item,index)=>{
          if(item.isAdd) selectedRows.push(index);
        });
      }else{
        selectedRows = [];
      }
    }
    this.setState({
      selectedRows:selectedRows
    });
  },

  _handleItemTouch(e,action){

  },

  _handleBlur(key,parseToNumber){
    if(parseToNumber) this.refs[key].setValue(this._parseValueToFixed(this.refs[key].getValue(),TO_FIXED_LEN));
  },

  _parseValueToFixed(value,length){
    let v = parseFloat(value);
    return v ? v.toFixed(length) : value;
  },

  _handleAddChargeFee(){
    if(!global.isOrderDetailsChanged()){
      global.notifyOrderDetailsChange(true,()=>{this._addChargeFee()});
    }else{
      this._addChargeFee();
    }
  },

  _addChargeFee(){
    let costItems = this.state.costItems;
    let selectedRows = this.state.selectedRows;
    let costItemEst = {
      id: Math.random()*10001,
      amount: 0,
      product: this.props.product._id,
      variables: {},
      isAdd:true
    };
    costItems.push(costItemEst);
    if(this.refs['table_'+this.props.product.code] && this.refs['table_'+this.props.product.code].isAllRowsSelected()){
      selectedRows.push(costItems.length-1);
    }
    this.setState({
      costItems:costItems,
      selectedRows:selectedRows
    });
  },

  _handleRemoveSelection(){
    if(!global.isOrderDetailsChanged()){
      global.notifyOrderDetailsChange(true,()=>{this._removeSelection()});
    }else{
      this._removeSelection();
    }
  },

  _removeSelection(){
    let selectedRows = this.state.selectedRows;
    let costItems = this.state.costItems;
    _.remove(costItems,(item,index)=>{
      return _.includes(selectedRows,index);
    });
    this.setState({
      selectedRows:[],
      allRowsSelected: false,
      costItems:costItems
    });
  },

  _handleSelectFieldChange(id,value){
    this._handleChange();
    if(this.props.product){
      let costTypes = this.props.product.costTypes;
      let costType = null;
      _.forEach(costTypes,ct=>{
        if(!_.isString(ct.costType) && ct.costType._id ===value){
          costType=ct.costType;
        }
      });
      if(costType){
        let costItems = this.state.costItems;
        _.forEach(costItems,item=>{
            let itemId = item.id ||item._id;
            if(itemId === id){
              item.costType =costType;
            }
        });
        this.setState({costItems:costItems});
      }
    }
  },

  _handleChange(fn){
    if(!global.isOrderDetailsChanged()){
      global.notifyOrderDetailsChange(true);
    }
  },

});

module.exports = PriceTable;
