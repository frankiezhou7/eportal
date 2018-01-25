const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const AddIcon = require('epui-md/svg-icons/content/add');
const DeleteIcon = require('epui-md/svg-icons/action/delete');
const EditIcon = require('epui-md/svg-icons/image/edit');
const FlatButton = require('epui-md/FlatButton');
const IconButton = require('epui-md/IconButton');
const IconLabelButton = require('epui-md/ep/IconLabelButton');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Table = require('epui-md/Table/Table');
const TableBody = require('epui-md/Table/TableBody');
const TableFooter = require('epui-md/Table/TableFooter');
const TableHeader = require('epui-md/Table/TableHeader');
const TableHeaderColumn = require('epui-md/Table/TableHeaderColumn');
const TableRow = require('epui-md/Table/TableRow');
const TableRowColumn = require('epui-md/Table/TableRowColumn');
const Translatable = require('epui-intl').mixin;
const UniqueId = require('epui-md/utils/unique-id');
const PropTypes = React.PropTypes;

const AnchorageTable = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Anchorage/${__LOCALE__}`),

  propTypes: {
    actions: PropTypes.object,
    enableSelectAll: PropTypes.bool,
    deselectOnClickaway: PropTypes.bool,
    fixedFooter: PropTypes.bool,
    fixedHeader: PropTypes.bool,
    header: PropTypes.array,
    height: PropTypes.number,
    multiSelectable: PropTypes.bool,
    nTextAddAnchorage: PropTypes.string,
    nTextAnchorage: PropTypes.string,
    nTextAnchorageDraft: PropTypes.string,
    nTextDischargeRate: PropTypes.string,
    nTextMaxDraft: PropTypes.string,
    nTextMaxGRT: PropTypes.string,
    nTextMaxDWT: PropTypes.string,
    nTextPayloadType: PropTypes.string,
    nTextOperation: PropTypes.string,
    portId: PropTypes.string,
    rows: PropTypes.array,
    selectable: PropTypes.bool,
    showRowHover: PropTypes.bool,
    stripedRows: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
    };
  },

  getInitialState() {
    return {
      header: this.props.header,
      rows: this.props.rows,
    };
  },

  componentDidMount() {
    global.onDismissAnchorageDialog = this._handleDismissAnchorageDialog;
  },

  componentWillReceiveProps(nextProps) {
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
      },
      addButtonIconStyle: {
        fill: '#2196f3',
      },
      addButtonLabelStyle: {
        maxWidth: '100%',
        color: '#2196f3',
      },
      deleteIconButton: {
        float: 'left',
      },
      deleteIcon: {
        fill: '#2196f3',
      },
      iconLabelButtonWrapper: {
        margin: '16px 0 16px 300px',
        width: '100px',
      },
    };

    return styles;
  },

  getValue() {
    let rows = this.state.rows;
    let value = [];

    if(_.isArray(rows)) {
      _.forEach(rows, (row, index) => {
        delete row.__id;
        let id = row._id;

        if (id) {
          value.push(id);
        } else {
          value.push(row);
        }
      });
    }

    return value;
  },

  renderTable() {
    let {
      header,
      rows,
    } = this.state;

    let table = (
      <Table
        key={Math.random()}
        fixedHeader={this.props.fixedHeader}
        fixedFooter={this.props.fixedFooter}
        height={this.props.height}
        multiSelectable={this.props.multiSelectable}
        selectable={this.props.selectable}
        onRowSelection={this._onRowSelection}
      >
        {this.renderTableHeader(header)}
        {this.renderTableBody(header, rows)}
        {this.renderTableFooter()}
      </Table>
    );

    return table;
  },

  renderTableHeader(header) {
    let columnElements = [];

    if (_.isArray(header)) {
      header.forEach((col, index) => {
        let text = this.t(col.text);

        columnElements.push(
          <TableHeaderColumn
            key={Math.random()}
            tooltip={text}
          >
          {text}
          </TableHeaderColumn>
        );
      });
    }

    if (columnElements.length) {
      let text = this.t('nTextOperation');

      columnElements.push(
        <TableHeaderColumn
          key={Math.random()}
          tooltip={text}
        >
        {text}
        </TableHeaderColumn>
      );
    }

    return (
      <TableHeader
        key={Math.random()}
        adjustForCheckbox={false}
        displaySelectAll={false}
        enableSelectAll={this.props.enableSelectAll}
      >
        <TableRow
          key={Math.random()}
        >
          {columnElements}
        </TableRow>
      </TableHeader>
    );
  },

  renderTableBody(header, rows) {
    let styles = this.getStyles();
    let rowElements = [], rowsElements = [];

    if (_.isArray(rows)) {
      rows.forEach((row, index) => {
        if (_.isArray(header)) {
          header.forEach((col, idx) => {
            let field = col.field;
            let cell = row[field];

            rowElements.push(
              <TableHeaderColumn
                key={`${index}.${idx}`}
              >
                {cell}
              </TableHeaderColumn>
            );
          });

          let operationCol = (
            <TableHeaderColumn
              key='delete'
            >
              <IconButton
                key="editIconButton"
                style={this.style('deleteIconButton')}
                iconStyle={this.style('deleteIcon')}
                onTouchTap={this._handleTouchTapEdit.bind(this, index)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                key="deleteIconButton"
                style={this.style('deleteIconButton')}
                iconStyle={this.style('deleteIcon')}
                onTouchTap={this._handleTouchTapRemove.bind(this, index)}
              >
                <DeleteIcon />
              </IconButton>
            </TableHeaderColumn>
          );

          let tableRow = (
            <TableRow
              key={index}
              selected={true}
            >
            {rowElements}
            {operationCol}
            </TableRow>
          );

          rowsElements.push(tableRow);

          rowElements = [];
        }
      });
    }

    return (
      <TableBody
        key={Math.random()}
        deselectOnClickaway={this.props.deselectOnClickaway}
        displayRowCheckbox={false}
        showRowHover={this.props.showRowHover}
        stripedRows={this.props.stripedRows}
      >
      {rowsElements}
      </TableBody>
    );
  },

  renderTableFooter() {
    let styles = this.getStyles();

    return (
      <TableFooter
        key={Math.random()}
      >
        <TableRow>
          <TableRowColumn
            colSpan="3"
            style={{textAlign: 'center'}}
          >
            <div
              style={styles.iconLabelButtonWrapper}
            >
              <IconLabelButton
                iconElement={<AddIcon />}
                iconStyle={styles.addButtonIconStyle}
                label={this.t('nTextAddAnchorage')}
                labelStyle={styles.addButtonLabelStyle}
                handleTouchTap={this._handleTouchTapAdd}
              />
            </div>
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    );
  },

  render() {
    let styles = this.getStyles();

    return (
      <div
        key={Math.random()}
        style={this.style('root')}
      >
        {this.renderTable()}
      </div>
    );
  },

  _handleDismissAnchorageDialog(anchorage) {
    let anchorageId = anchorage._id || anchorage.__id;
    let header = this.state.header;
    let rows = this.state.rows;
    let exist = false;

    if (_.isArray(rows)) {
      _.forEach(rows, (row, index) => {
        let id = row._id || row.__id;

        if (anchorageId === id) {
          exist = true;
          rows[index] = anchorage;
        }
      });

      if (!exist) {
        if (!anchorageId) {
          anchorage.__id = UniqueId.generate();
        }

        rows.push(anchorage);
      }
    }

    this.setState({
      rows: rows,
    });
  },

  _handleTouchTapAdd() {
    let portId = this.props.portId;

    global.showAnchorageDialog(portId);
  },

  _handleTouchTapEdit(index) {
    let actions = this.props.actions;
    let rows = this.state.rows;
    let anchorage = rows[index];
    let anchorageId = anchorage._id;
    let portId = this.props.portId;

    if (anchorageId) {
      global.showAnchorageDialog(portId, anchorageId);
    }
    else {
      global.showAnchorageDialog(portId, anchorageId, anchorage);
    }
  },

  _handleTouchTapRemove(index) {
    let actions = this.props.actions;
    let rows = this.state.rows;
    let anchorageId = rows[index]['_id'];

    rows = _.remove(rows, (row, idx) => {
      return idx !== index;
    });

    this.setState({
      rows: rows,
    }, () => {
      // if (anchorageId) {
      //   actions.removeAnchorageById(anchorageId);
      // }
    });
  },

  _onRowSelection() {

  },

});

module.exports = AnchorageTable;
