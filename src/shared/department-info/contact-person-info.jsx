const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField');
const RaisedButton = require('epui-md/RaisedButton');
const ContactInfo = require('../contact-info');
const PersonItem = require('./person-item');
const { createPerson, removePersonById } = global.api.epds;

const ContactPersonInfo = React.createClass({
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
    value: PropTypes.object,
    parentId: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value }= this.props;
    let ids = [];
    if(value){
      for(let val of value){
        ids.push(val._id);
      }
    }
    return {
      persons: [],
      personId: value ? value.length : 0,
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

      },
      button:{
        width: 430,
        textAlign: 'center',
        marginTop: 30,
      }
    };

    return styles;
  },

  getValue() {
    let result = [];
    let { removedIds, ids} = this.state;
    result = _.xor(ids, removedIds);

    return result;
  },

  getPersonValue(){
    let items = [];
    let { personId, selectedIds } = this.state;
    let { value } = this.props;
    let length = value && value.length;
    let total = personId ? personId : length;
    for(let idx = 0; idx < total; idx++){
      if(_.indexOf(selectedIds, idx) !== -1) continue;
      let val = this.refs[`item${idx}`] && this.refs[`item${idx}`].getValue();
      items.push(val);
    }

    return items;
  },

  renderPersonItem(value){
    let { personId } = this.state;
    let personElems = [];
    let length = value && value.length;
    let total = personId ? personId : length;
    for(let idx = 0; idx < total; idx++){
      personElems.push(
        <PersonItem
          ref={`item${idx}`}
          personId={idx}
          onRemoveItem={this._handleDeleteItem}
          value={value && value[idx]}
        />
      );
    }

    return personElems;
  },

  render() {
    let styles = this.getStyles();
    const {
      value,
      ...other,
    } = this.props;
    return (
      <div style={this.style('root')}>
        {this.renderPersonItem(value)}
        <div style={this.style('button')}>
          <RaisedButton
            key='addPerson'
            label={this.t('nButtonAddContactPerson')}
            capitalized='capitalize'
            primary={true}
            onTouchTap={this._handleAddTouchTap} />
        </div>
      </div>
    );
  },

  _handleAddTouchTap() {
    let personId = this.state.personId + 1;
    let { ids, removedIds} = this.state;
    let length = _.xor(ids, removedIds).length;

    if(length < 5)

    this.setState({personId}, () => {
        this.createTimeout = setTimeout(() => {
          if (_.isFunction(createPerson)) {
            let person = _.omit(this.refs[`item${personId - 1}`].getValue(), ['contactMethods']);
            let value = Object.assign({}, person, {memberOf:this.props.parentId});
            createPerson
              .promise(value)
              .then(({ response }) => {
                const id = _.get(response, '_id');

                  // alert(this.t('nTextSavePersonInfoSuccess'));
                  ids.push(id);
                  this.setState({
                    ids,
                  });
              })
              .catch(err => {
                alert(this.t('nTextSavePersonInfoFail'));
              });
          }
      },1000);
    });
  },

  _handleDeleteItem(personId, __v) {
    let { ids, removedIds, selectedIds } = this.state;
    let id = _.head(ids.slice(personId, personId + 1));
    removedIds.push(id);
    selectedIds.push(personId);

    this.setState({removedIds,selectedIds, __v},() => {
        this.deleteTimeout = setTimeout(() => {
          if (_.isFunction(removePersonById)) {
            removePersonById
              .promise(id, this.state.__v)
              .then(({ response }) => {
                // alert(this.t('nTextDeletePersonInfoSuccess'));
              })
              .catch(err => {
                console.log(err);
                alert(this.t('nTextDeletePersonInfoFail'));
              });
          }
      },1000);
    });
  },
});

module.exports = ContactPersonInfo;
