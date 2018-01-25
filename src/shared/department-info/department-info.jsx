const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const Paper = require('epui-md/Paper');
const DepartmentItem = require('./department-item');
const RaisedButton = require('epui-md/RaisedButton');
const {createOrganization, removeOrganizationById} = global.api.epds;
const DepartmentInfo = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Organization/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.array,
    parentId: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value } = this.props;
    let ids = [];
    if(value){
      for(let val of value){
        ids.push(val._id);
      }
    }

    return {
      departments: [],
      departmentId: value ? value.length : 0,
      ids: ids || [],
      removedIds: [],
      selectedIds: [],
    };
  },

  componentWillUnmount() {
    clearTimeout(this.createTimeout);
    clearTimeout(this.deleteTimeout);
  },

  getStyles() {
    let styles = {
      root: {
        marginLeft: 20,
      },
      button: {
        marginTop: 30,
        textAlign: 'center',
      }
    };

    return styles;
  },

  getValue() {
    let result = [];
    let { removedIds, ids} = this.state;
    result = _.xor(ids, removedIds);
    return {
      children: result,
    };
  },

  getDepartmentValue(){
    let items = [];
    let { departmentId, selectedIds } = this.state;
    let { value } = this.props;
    let length = value && value.length;
    let total = departmentId ? departmentId : length;
    for(let idx = 0; idx < total; idx++){
      if(_.indexOf(selectedIds, idx) !== -1) continue;
      let val = this.refs[`item${idx}`] && this.refs[`item${idx}`].getValue();
      items.push(val);
    }

    return items;
  },

  getPersonsValue(){
    let items = [];
    let { departmentId, selectedIds } = this.state;
    let { value } = this.props;
    let length = value && value.length;
    let total = departmentId ? departmentId : length;
    for(let idx = 0; idx < total; idx++){
      if(_.indexOf(selectedIds, idx) !== -1) continue;
      let val = this.refs[`item${idx}`] && this.refs[`item${idx}`].getPersonValue();
      items.push(val);
    }

    return items;
  },

  getPersonIds(){
    let items = [];
    let { departmentId, selectedIds } = this.state;
    let { value } = this.props;
    let length = value && value.length;
    let total = departmentId ? departmentId : length;
    for(let idx = 0; idx < total; idx++){
      if(_.indexOf(selectedIds, idx) !== -1) continue;
      let val = this.refs[`item${idx}`] && this.refs[`item${idx}`].getPersonIds();
      items.push(val);
    }

    return items;
  },

  renderDepartmentItem(value){
    let { departmentId } = this.state;
    let departmentElems = [];
    let length = value && value.length;
    let total = departmentId ? departmentId : length;
    for(let idx = 0; idx < total; idx++){
      departmentElems.push(
        <DepartmentItem
          ref={`item${idx}`}
          departmentId={idx}
          onRemoveItem={this._handleDeleteItem}
          value={value && value[idx]}
          childId={this.state[`item${idx}Id`]}
        />
      );
    }

    return departmentElems;
  },

  render() {
    let styles = this.getStyles();
    const {
      value,
    } = this.props;
    return (
      <div style={this.style('root')}>
        {this.renderDepartmentItem(value)}
        <div style={this.style('button')}>
          <RaisedButton
            key='save'
            label={this.t('nButtonAddDepartment')}
            primary={true}
            capitalized='capitalize'
            onTouchTap={this._handleAddTouchTap} />
        </div>
      </div>
    );
  },

  _handleAddTouchTap() {
    let departmentId = this.state.departmentId + 1;
    let { ids } = this.state;

    this.setState({departmentId}, () => {
        this.createTimeout = setTimeout(() => {
          if (_.isFunction(createOrganization)) {
            let department = _.omit(this.refs[`item${departmentId - 1}`].getValue(), ['contactMethods', 'address', 'contactPersons']);
            let value = Object.assign({}, department, {parent:this.props.parentId});
            createOrganization
              .promise(value)
              .then(({ response }) => {
                const id = _.get(response, '_id');

                  // alert(this.t('nTextSaveDepartmentInfoSuccess'));
                  ids.push(id);
                  this.setState({
                    ids,
                    [`item${departmentId - 1}Id`]: id,
                  });
              })
              .catch(err => {
                console.log(err);
                alert(this.t('nTextSaveDepartmentInfoFail'));
              });
          }
      },1000);
    });
  },

  _handleDeleteItem(departmentId, __v) {
    let { ids, removedIds, selectedIds } = this.state;

    let id = _.head(ids.slice(departmentId, departmentId + 1));
    removedIds.push(id);
    selectedIds.push(departmentId);

    this.setState({removedIds,selectedIds, __v},() => {
        this.deleteTimeout = setTimeout(() => {
          if (_.isFunction(removeOrganizationById)) {
            removeOrganizationById
              .promise(id, this.state.__v)
              .then(({ response }) => {
                // alert(this.t('nTextDeleteDepartmentInfoSuccess'));
              })
              .catch(err => {
                alert(this.t('nTextDeleteDepartmentInfoFail'));
              });
          }
      },1000);
    });
  },
});

module.exports = DepartmentInfo;
