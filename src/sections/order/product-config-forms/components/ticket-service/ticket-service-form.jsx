const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const AddButton = require('epui-md/svg-icons/content/add');
const FlatButton = require('epui-md/FlatButton');
const TicketServiceInnerForm = require('./ticket-service-inner-form');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;

let TicketServiceForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    config: PropTypes.object,
    product :PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    nLabelDetailRequest: PropTypes.string,
    nLabelSelectPerson: PropTypes.string,
    nLabelpersonsContainerTitle: PropTypes.string,
    nTextAddPersonFirst: PropTypes.string,
    nTextAddFlights: PropTypes.string,
    persons: PropTypes.array,
    personsRemoved: PropTypes.array,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    let { config } = this.props;
    return {
      count: config && config.length ? config.length : 1,
      removedIds: [],
    }
  },

  getValue() {
    let { removedIds, count } = this.state;
    let el = [];

    for(let i = 0; i < count; i++) {
      if(_.indexOf(removedIds, i) !== -1) continue;
      let val = this.refs[`ticketService${i}`] && this.refs[`ticketService${i}`].getValue();
      el.push(val);
    }
    return el;
  },

  isDirty(){
    let { removedIds, count } = this.state;
    let dirty = false;
    for(let i = 0; i < count; i++) {
      if(_.indexOf(removedIds, i) !== -1) continue;
      let val = this.refs[`ticketService${i}`] && this.refs[`ticketService${i}`].isDirty();
      if(val) return true;
    }
    return dirty;
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let styles = {
      root:{

      },
      addBtn:{
        textAlign: 'center',
        margin: 'auto',
      },
      addBtnLabel:{
        marginLeft: padding*5,
        fontSize: 16,
        color: '#f5a623',
        verticalAlign: 'middle',
      },
      button: {
        width: 18,
        height: 18,
        verticalAlign: 4,
        fill: '#fff',
      },
      circle: {
        width: 18,
        height: 18,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        backgroundColor: '#f5a623',
      }
    };
    return styles;
  },

  renderTicketServiceInnerForm() {
    let {
      config,
      order,
      orderEntry,
      product,
      productConfig,
      persons,
      personsRemoved,
    } = this.props;

    let formElems = [];
    let length = this.state.count;

    for(let i = 1; i < length; i++) {
      formElems.push(
        <TicketServiceInnerForm
          ref = {`ticketService${i}`}
          config = {config && config[i]}
          ticketId = {i}
          persons = {persons}
          order={order}
          orderEntry={orderEntry}
          product={product}
          productConfig ={productConfig}
          personsRemoved = {personsRemoved}
          deleteTicket={this._handleDeleteTicket}
        />
      );
    }
    return formElems;
  },

  renderAddBtn(){
    return(
      <div style = {this.style('addBtn')}>
        <FlatButton
          onTouchTap={this._handleAddTouch}
          backgroundColor={'rgba(0,0,0,0)'}
          >
          <span style={this.style('circle')}>
            <AddButton style={this.style('button')}/>
          </span>
          <span style = {this.style('addBtnLabel')}>{this.t('nTextAddFlights')}</span>
        </FlatButton>
      </div>
    );
  },

  render() {
    let {
      config,
      order,
      orderEntry,
      product,
      productConfig,
      persons,
      personsRemoved,
    } = this.props;

    let styles = this.getStyles();

    return (
      <div style = {this.style('root')}>
        <TicketServiceInnerForm
          ref = 'ticketService0'
          config = {config && config[0]}
          ticketId = {0}
          persons = {persons}
          order={order}
          orderEntry={orderEntry}
          product={product}
          productConfig ={productConfig}
          personsRemoved = {personsRemoved}
        />
        {this.renderTicketServiceInnerForm()}
        {this.renderAddBtn()}
      </div>
    );
   },

   _handleAddTouch() {
     let count = ++this.state.count;
     this.setState({count});
     global.notifyOrderDetailsChange(true);
   },

   _handleDeleteTicket(ticketId) {
     global.notifyOrderDetailsChange(true);
     let { removedIds } = this.state;
     removedIds.push(ticketId);

     this.setState({
       removedIds,
     });
   },
});

module.exports = TicketServiceForm;
