const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const AutoStyle = require('epui-auto-style').mixin;
const ChoosePersons = require('../choose-persons');
const ClearButton = require('epui-md/svg-icons/content/clear');
const DivButton = require('../div-button');
const IconButton = require('../icon-button');
const PropTypes = React.PropTypes;
const RemoveButton = require('epui-md/svg-icons/content/remove');
const DropDownAirports = require('~/src/shared/dropdown-airports');
const Table = require('epui-md/Table/Table');
const TableBody = require('epui-md/Table/TableBody');
const TableHeader = require('epui-md/Table/TableHeader');
const TableHeaderColumn = require('epui-md/Table/TableHeaderColumn');
const TableRow = require('epui-md/Table/TableRow');
const TableRowColumn = require('epui-md/Table/TableRowColumn');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const FlightItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    flightInfo: PropTypes.object,
    personsToChoose: PropTypes.array,
    nLabelFlightNum: PropTypes.string,
    nLabelDepaAirPort: PropTypes.string,
    nLabelArriAirPort: PropTypes.string,
    nLabelDepaEst: PropTypes.string,
    nLabelArriEst: PropTypes.string,
    nLabelClickToEdit: PropTypes.string,
    onAddFlight:PropTypes.func,
    onRemoveFlight:PropTypes.func,
    onRemoveFlightInfo:PropTypes.func,
    onRemovePerson:PropTypes.func,
    onChoosePerson:PropTypes.func,
    showRemoveFlightInfoBtn: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      flightInfo : [],
      personsToChoose:[],
      showRemoveFlightInfoBtn: true,
    };
  },

  getInitialState: function() {
    return {

    };
  },

  getFlightInfo(){
    let flightInfo = this.props.flightInfo;
    let flights = flightInfo.flights;
    _.forEach(flights,flight=>{
      for(let key in flight){
        if(key !=='id'){
          flight[key]=this.refs['input_'+flight.id+'_'+key].getValue();
        }
      }
    });
    return flightInfo;
  },

  isDirty(){

  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let fontSize = 13;
    let theme = this.getTheme();

    return {
      root: {
        border: '1px solid #DCDCDC',
        padding: padding * 5,
        marginBottom: padding * 5,
        minHeight: 16,
      },
      tableStyle: {
        position: 'relative',
        backgroundColor: 'transparent',
        textAlign: 'center',
        border: '1px solid #DCDCDC',
      },
      textField: {
        width: 'initial',
      },
      underlineStyle: {
        display:'none',
      },
      hintStyle: {
        fontSize: fontSize,
      },
      inputStyle: {
        fontSize: fontSize,
        textOverflow: 'ellipsis',
      },
      removeFlight: {
        cursor: 'pointer',
      },
      addFlightBtn: {
        cursor: 'pointer',
      },
      flight: {
        marginBottom: padding * 5,
      },
      removeFlightInfo: {
        cursor: 'pointer',
        width:'100%',
        textAlign: 'right',
        marginBottom: -30,
      },
      flightAirport: {
        width: 150,
        bottom: 6,
      },
      flightAirportLabel: {
        fontSize: 13,
      },
      tableColLeft: {
        width: 60,
        paddingLeft:20,
        paddingRight:10,
      },
      tableColMid: {
        width: 150,
        paddingLeft:10,
        paddingRight:10,
      },
      tableColRight: {
        width: 120,
        paddingLeft:10,
        paddingRight:10,
      },
      tableColBtn: {
        width: 30,
        paddingLeft:10,
        paddingRight:10,
      },
      personsToChoose:{
        borderTop: 'none',
        backgroundColor: '#edf5fe',
      },
    };
  },

  renderDeleteBtn() {
    let flightInfo = this.props.flightInfo;
    let theme = this.getTheme();

    if(this.props.showRemoveFlightInfoBtn) {
      return (
        <div
          style={this.style('removeFlightInfo')}
          onClick={this._handleRemoveFlightInfo}
        >
          <ClearButton />
        </div>
      );
    }

    return null;
  },

  renderPersonsList() {
    return (
      <ChoosePersons
        style = {this.style('personsToChoose')}
        onChoosePerson={this._handleChoosePerson}
        onRemovePerson={this._handleRemovePerson}
        personsChoosen={this.props.flightInfo.persons}
        personsToChoose={this.props.personsToChoose}
      />
    );
  },

  renderFlightsList() {
    let theme = this.getTheme();
    let tableRows = [];
    let flights = this.props.flightInfo.flights;

    _.forEach(flights, flight => {
      let rowCols = [];
      let flightObjLeft = {id:flight.id,number:flight.number};
      let flightObjMiddle = {depaAirPort:flight.depaAirPort,arriAirPort:flight.arriAirPort};
      let flightObjRight = {depaEstTime:flight.depaEstTime,arriEstTime:flight.arriEstTime};

      for(let key in flightObjLeft) {
        if(key !== 'id') {
          rowCols.push(
            <TableRowColumn
              key={'col_' + flight.id + '_' + key}
              style={this.style('tableColLeft')}
            >
              <TextField
                key={'input_' + flight.id + '_' + key}
                ref={'input_' + flight.id + '_' + key}
                defaultValue={flightObjLeft[key]}
                hintStyle={this.style('hintStyle')}
                hintText={this.t('nLabelClickToEdit')}
                inputStyle={this.style('inputStyle')}
                style={this.style('textField')}
                underlineStyle={this.style('underlineStyle')}
                onChange={this._handleChange}
              />
            </TableRowColumn>
          );
        }
      }

      for(let key in flightObjMiddle) {
        if(key !== 'id') {
          rowCols.push(
            <TableRowColumn
              key={'col_' + flight.id + '_' + key}
              style={this.style('tableColMid')}
            >
              <DropDownAirports
                key={'input_' + flight.id + '_' + key}
                ref={'input_' + flight.id + '_' + key}
                value={flightObjMiddle[key]}
                //floatingLabelText={this.t('nLabelClickToEdit')}
                style={this.style('flightAirport')}
                floatingLabelStyle={this.style('flightAirportLabel')}
                onChange={this._handleChange}
                underlineShow={false}
                width={350}
                margin={-120}
              />
            </TableRowColumn>
          );
        }
      }

      for(let key in flightObjRight) {
        if(key !== 'id') {
          rowCols.push(
            <TableRowColumn
              key={'col_' + flight.id + '_' + key}
              style={this.style('tableColRight')}
            >
              <TextField
                key={'input_' + flight.id + '_' + key}
                ref={'input_' + flight.id + '_' + key}
                defaultValue={flightObjRight[key]}
                hintStyle={this.style('hintStyle')}
                hintText={this.t('nLabelClickToEdit')}
                inputStyle={this.style('inputStyle')}
                style={this.style('textField')}
                underlineStyle={this.style('underlineStyle')}
                onChange={this._handleChange}
              />
            </TableRowColumn>
          );
        }
      }
      //add actions for each row
      rowCols.push(
        <TableRowColumn
          key={'col_' + flight.id + '_actions'}
          style={this.style('tableColBtn')}
        >
          <IconButton
            title='删除此航班'
            refId={flight.id}
            key={'action_'+flight.id}
            style={this.style('removeFlight')}
            onClick={this._handleRemoveFlight}
          >
            <RemoveButton />
          </IconButton>
        </TableRowColumn>
      );

      tableRows.push(
        <TableRow key={'row_' + flight.id}>{rowCols}</TableRow>
      );
    });

    return (
      <Table
        key="table"
        style={this.style('tableStyle')}
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn style={this.style('tableColLeft')} >{this.t('nLabelFlightNum')}</TableHeaderColumn>
            <TableHeaderColumn style={this.style('tableColMid')}>{this.t('nLabelDepaAirPort')}</TableHeaderColumn>
            <TableHeaderColumn style={this.style('tableColMid')}>{this.t('nLabelArriAirPort')}</TableHeaderColumn>
            <TableHeaderColumn style={this.style('tableColRight')}>{this.t('nLabelDepaEst')}</TableHeaderColumn>
            <TableHeaderColumn style={this.style('tableColRight')}>{this.t('nLabelArriEst')}</TableHeaderColumn>
            <TableHeaderColumn style={this.style('tableColBtn')}>
              <AddButton
                style={this.style('addFlightBtn')}
                onClick={this._handleAddFlight}
              />
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={true}
        >
          {tableRows}
        </TableBody>
      </Table>
    );
  },

  render() {
    return (
      <div style={this.style('flight')}>
        {this.renderDeleteBtn()}
        {this.renderPersonsList()}
        {this.renderFlightsList()}
      </div>
    );
  },

  _handleAddFlight() {
    global.notifyOrderDetailsChange(true);
    if (this.props.onAddFlight) {
      this.props.onAddFlight(this.props.flightInfo.id);
    }
  },

  _handleRemoveFlight(flightId) {
    global.notifyOrderDetailsChange(true);
    if (this.props.onRemoveFlight) {
      this.props.onRemoveFlight(this.props.flightInfo.id, flightId);
    }
  },

  _handleRemoveFlightInfo() {
    global.notifyOrderDetailsChange(true);
    if (this.props.onRemoveFlightInfo) {
      this.props.onRemoveFlightInfo(this.props.flightInfo.id);
    }
  },

  _handleRemovePerson(id) {
    global.notifyOrderDetailsChange(true);
    if (this.props.onRemovePerson) {
      let flightInfo = this.props.flightInfo;
      _.remove(flightInfo.persons, person => {
        return person.id == id;
      });
      this.props.onRemovePerson(flightInfo);
    }
  },

  _handleChoosePerson(personsChoosen) {
    global.notifyOrderDetailsChange(true);
    if (this.props.onChoosePerson) {
      let flightInfo = this.props.flightInfo;
      _.forEach(personsChoosen, person => {
        flightInfo.persons.push(person);
      });
      this.props.onChoosePerson(flightInfo);
    }
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = FlightItem;
