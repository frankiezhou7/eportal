const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const BerthDialog = require('../add-berth-dialog');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const FlatButton = require('epui-md/FlatButton');
const Paper = require('epui-md/Paper');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const TerminalForm = require('./terminal-form');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const Terminal = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/Port/${__LOCALE__}`),

  propTypes: {
    form: PropTypes.object,
    getTerminalNamesByPortId: PropTypes.func,
    nTextAdd: PropTypes.string,
    nTextRemove: PropTypes.string,
    port: PropTypes.object,
    portId: string,
    removeTerminalById: PropTypes.func,
    update: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let port = this.props.port;
    let terminals = port.get('terminals');

    return {
      terminals: terminals,
      selectedIndex: 0,
    };
  },

  componentWillMount() {
    let port = this.props.port;
    let portId = this.props.portId;
    let terminals = port ? port.terminals : undefined;

    if (portId && !terminals) {
      this.props.getTerminalNamesByPortId(portId);
    }
  },

  componentWillReceiveProps(nextProps) {
    let port = nextProps.port;
    let portId = nextProps.portId;
    let prevTerminals = this.props.port.terminals;
    let terminals = port.get('terminals');
    let remove = nextProps.remove;

    if (remove && remove.getMeta('loading')) { return; }
    if (terminals && terminals.getMeta('loading')) { return; }
    let error = remove && remove.getMeta('error');

    if (portId && (!terminals || this.__deleteButtonClicked || error)) {
      this.props.getTerminalNamesByPortId(portId);
      this.__deleteButtonClicked = false;
    }

    let removedTerminal = remove && remove.get('terminal');

    terminals.forEach((terminal, index) => {
      if (terminal.get('_id') === removedTerminal.get('_id')) {
        terminals = terminals.delete(index);
      }
    });

    this.setState({
      terminals: terminals,
    });
  },

  getStyles() {
    let styles = {
      root: {
        margin: '0 auto',
        padding: '10px 10px',
        width: global.contentWidth,
        minHeight: '100%',
        overflow: 'hidden',
      },
      removeWrapper: {
        position: 'relative',
        display: 'inline-block',
        width: '100px',
        height: '48px',
        top: '-15px',
      },
      remove: {
      },
      top: {
        margin: '10px 0',
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let port = this.props.port;
    let portId = this.props.portId;
    let actions = this.props;
    let form = this.props.form;
    let update = this.props.update;
    let terminals = this.state.terminals;
    let menuItems = [];
    let selectedIndex = this.state.selectedIndex;

    if (terminals && terminals.size) {
      terminals.forEach((terminal, index) => {
        let id = terminal.get('_id');
        let name = terminal.get('name');

        menuItems.push({
          _id: terminal.get('_id'),
          name: terminal.get('name'),
        });
      });
    }

    menuItems.push({
      _id: 0,
      name: this.t('nTextAdd')
    });

    let menuItem = menuItems[selectedIndex];

    let removeElement = menuItem._id === 0 ? null : (
      <div
        style={this.style('removeWrapper')}
      >
        <FlatButton
          ref="remove"
          label={this.t('nTextRemove')}
          primary={true}
          style={this.style('remove')}
          onTouchTap={this._handleTouchTapRemove.bind(this, menuItem)}
        />
      </div>
    );

    return (
      <div
        style={this.style('root')}
      >
        <div
          style={this.style('top')}
        >
          <DropDownMenu
            ref="terminals"
            displayMember="name"
            valueMember="_id"
            menuItems={menuItems}
            selectedIndex={selectedIndex}
            onChange={this._handleChange}
          />
          {removeElement}
        </div>
        <TerminalForm
          ref="terminalForm"
          actions={actions}
          form={form}
          portId={portId}
          terminal={menuItem}
          update={update}
        />
        <BerthDialog
          ref="berthDialog"
        />
    </div>
    );
  },

  _handleChange(e, selectedIndex, menuItem) {
    this.setState({
      selectedIndex: selectedIndex,
    });
  },

  _handleTouchTapRemove(menuItem) {
    let port = this.props.port;

    let terminalId = menuItem._id;

    this.__deleteButtonClicked = true;

    this.props.removeTerminalById(terminalId);
  },

});

module.exports = Terminal;
