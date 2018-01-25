const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Button = require('../button');
const CompanyCard = require('./company-card');
const CompanyForm = require('../company-form');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const CompanyCardList = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    companyCardInfos: PropTypes.array,
    dialogChild : PropTypes.element,
    editable: PropTypes.bool,
    iconHeight : PropTypes.number,
    nLabelAddCompanyInfos: PropTypes.string,
    nLabelCompanyCardsListTitle: PropTypes.string,
    nLabelEditCompanyInfos: PropTypes.string,
    nTextAdd: PropTypes.string,
    nTextAddCompany : PropTypes.string,
    nTextCancel: PropTypes.string,
    nTextEditCompany: PropTypes.string,
    onAdd: PropTypes.func,
    onDialogSubmit: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    style :PropTypes.object,
    title :PropTypes.string,
    title: PropTypes.string,
    viewTitle: PropTypes.string,
  },

  getDefaultProps() {
    return {
      companyCardInfos: [],
      iconHeight: 24,
      editable: true,
    };
  },

  getInitialState(){
    return {
      companyCardInfos: this.props.companyCardInfos,
      editCompany: null,
      open: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let iconLength = this.props.iconHeight;
    let companyCardsListStyle = {};
    if(this.props.style) {
      _.merge(companyCardsListStyle, this.props.style);
    }
    return {
      companyCardsList: companyCardsListStyle,
      buttonContainer: {
        marginTop: padding * 3,
      },
      button: {
        padding: 7,
      },
      addIcon: {
        position: 'absolute',
        fill: theme.canvasColor,
        height: iconLength,
        width: iconLength,
      },
      buttonLabel: {
        textAlign: 'center',
        maxWidth: iconLength * 3,
      },
      companyCardsInfosTitle: {
        marginBottom: padding * 5,
        marginBottom: padding * 5,
        display: 'block',
      },
      companyCardStyle: {
        display: 'inline-block',
        marginRight: 12,
        marginBottom: 20,
      },
    };
  },

  getValue() {
    return this.state.companyCardInfos;
  },

  renderCompanyCardsTitle() {
    return(
      <span style = {this.style('companyCardsInfosTitle')}>{this.props.editable ? this.props.title : this.props.viewTitle}</span>
    );
  },

  renderCompanyCardInfos() {
    let companyCardInfoElems = [];
    let companyCardInfos = this.state.companyCardInfos;
    _.forEach(companyCardInfos, companyCardInfo => {
      companyCardInfoElems.push(
        <CompanyCard
          companyInfo={companyCardInfo}
          editable={this.props.editable}
          key={companyCardInfo.id}
          onEdit={this._handleModifyCompany}
          onRemove={this._handleRemove}
          style={this.style('companyCardStyle')}
        />
      );
    });
    return companyCardInfoElems;
  },

  renderAddButton() {
    if(!this.props.editable) return null;

    return(
      <Button
        style={this.style('buttonContainer')}
        buttonStyle={this.style('button')}
        onClick={this._handleAddCompanyAction}
        nLabelButton={this.t('nTextAddCompany')}
      />
    );
  },

  renderDialog() {
    let addActions = [
      <FlatButton
        key='cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleDialogCancel}
      />,
      <FlatButton
        key='submit'
        label={this.state.editCompany ? this.t('nTextEditCompany'):this.t('nTextSave')}
        primary={true}
        onTouchTap={this._handleDialogSubmit}
      />,
    ];

    return(
      <Dialog
        ref='addCompanyDialog'
        actions={addActions}
        onRequestClose={this._handleRequestClose}
        open={this.state.open}
        title={this.state.editCompany ? this.t('nLabelEditCompanyInfos'):this.t('nLabelAddCompanyInfos') }
      >
        <CompanyForm
          ref='companyForm'
          companyInfos={this.state.editCompany || {}}
          notifyChanged={false}
          showTitle={false}
        />
      </Dialog>
    );
  },


  render() {
    let styles = this.getStyles();
    return (
      <div style = {this.style('companyCardsList')}>
        {this.renderCompanyCardsTitle()}
        {this.renderCompanyCardInfos()}
        {this.renderAddButton()}
        {this.renderDialog()}
      </div>
    );
  },

  _handleRemove(company) {
    if (global.isOrderDetailsChanged()) {
      this._remove(company);
    } else {
      global.notifyOrderDetailsChange(true, () => {
        this._remove(company);
      });
    }
  },

  _remove(company) {
    let companyCardInfos = this.state.companyCardInfos;
    companyCardInfos = _.reject(companyCardInfos, companyCardInfo => {
      return company.id == companyCardInfo.id;
    });
    this.setState({companyCardInfos: companyCardInfos});
  },

  _handleModifyCompany(company) {
    this.setState({
      editCompany: company,
      open: true,
    });
  },

  _handleAddCompanyAction() {
    this.setState({
      open: true,
    });
  },

  _handleDialogCancel() {
    this.setState({
      open: false,
    });
  },

  _handleDialogSubmit() {
    if (global.isOrderDetailsChanged()) {
      this._submit();
    } else {
      global.notifyOrderDetailsChange(true, () => {
        this._submit();
      });
    }
  },

  _submit() {
    let companyCardInfos = this.state.companyCardInfos;
    let editCompany = this.state.editCompany;
    if (editCompany) {
      _.forEach(companyCardInfos, companyCardInfo => {
        if (companyCardInfo.id === editCompany.id) {
          companyCardInfo = _.merge(companyCardInfo, this.refs.companyForm.getValue());
        }
      });
    } else {
      let newCompanyInfo = this.refs.companyForm.getValue();
      newCompanyInfo.id = Math.random() * 10001;
      companyCardInfos.push(newCompanyInfo);
    }

    this.setState({
      companyCardInfos: companyCardInfos,
      editCompany: null,
      open: false,
    });
  },

  _handleRequestClose() {},
});
module.exports = CompanyCardList;
