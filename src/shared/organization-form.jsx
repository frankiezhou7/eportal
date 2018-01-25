const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Loading = require('epui-md/ep/RefreshIndicator');
const OrganizationView = require('~/src/shared/organization-view');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

require('epui-intl/lib/locales/' + __LOCALE__);

const {
  createOrganization,
  findOrganizationById,
  updateOrganizationById,
  updatePersonById,
} = global.api.epds;

const OrganizationForm = React.createClass({
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
    children: PropTypes.element,
    organizationId: PropTypes.string,
    renderActions: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      id: this.props.organizationId ? this.props.organizationId : '',
      isFetching: !!this.props.organizationId,
      organization: { __v: 0 },
    };
  },

  componentWillMount() {
    this.renderActions();
    this.fetchOrganization();
  },

  componentWillUnmount() {

  },

  handleTouchTap() {
    let uploadComp = this.form.getUploadComponent();
    if(uploadComp.isDirty()) {
      alert(this.t('nTextRequireUpload'));
      return;
    }
    this.form
      .isValid()
      .then(valid => {
        if(valid){
          let value = this.form.getValue();
          value.country = value.address.country;
          // value.state = value.address.province;
          delete value.address.country;
          delete value.address.province;
          this.save(value);
        }
      });
  },

  fetchOrganization() {
    const { id } = this.state;
    if (id && _.isFunction(findOrganizationById)) {
      findOrganizationById
        .promise(id)
        .then(({ response }) => {
          this.setState({
            organization: response,
            isFetching: false,
          });
        })
        .catch(err => {
          alert(this.t('nTextFetchOrganizationInfoFail'));

          this.setState({
            isFetching: false,
          });
        });
    }
  },

  save(val) {
    const {
      id,
      organization: {
        __v,
      },
    } = this.state;

    let departmentVal = this.form.getDepartmentValue();
    let departmentIds = this.form.getDepartmentIds();
    let personVal = this.form.getPersonValue();
    let personIds = this.form.getPersonIds();

    if (id && _.isFunction(updateOrganizationById)) {
      val = _.isObject(val) ? _.assign({}, val, { __v: _.isUndefined(__v) ? 0 : __v }) : val;
      updateOrganizationById
        .promise(id, val)
        .then(({ response }) => {
          this.fetchOrganization();

          if(personIds && personIds[0] && personIds[0].length > 0 && _.isFunction(updatePersonById)){
            _.forEach(personIds, (idsArr, index) => {
              let personArr = personVal[index];
              _.forEach(idsArr, (id, index) => {
                let val = personArr[index];
                updatePersonById
                .promise(id, val)
                .then(({ response }) => {
                  // alert(this.t('nTextSavePersonInfoSuccess'));
                })
                .catch(err => {
                  alert(this.t('nTextSavePersonInfoFail'));
                });
              });
            });
          }

          if(departmentIds && departmentIds.length > 0){
            _.forEach(departmentVal, (val, index) => {
                let value = Object.assign({}, val, {parent:id});
                updateOrganizationById
                .promise(departmentIds[index], value)
                .then(({ response }) => {
                  // alert(this.t('nTextSaveDepartmentInfoSuccess'));
                })
                .catch(err => {
                  alert(this.t('nTextSaveDepartmentInfoFail'));
                });
            });
          }
          alert(this.t('nTextSaveOrganizationInfoSuccess'));
        })
        .catch(err => {
          alert(this.t('nTextSaveOrganizationInfoFail'));
        });

    } else if (_.isFunction(createOrganization)) {
      createOrganization
        .promise(val)
        .then(({ response }) => {
          const id = _.get(response, '_id');
          this.setState({
            organization: response,
            id,
          });

          this.fetchOrganization();

          if(personIds && personIds[0] && personIds[0].length > 0 && _.isFunction(updatePersonById)){
            _.forEach(personIds, (idsArr, index) => {
              let personArr = personVal[index];
              _.forEach(idsArr, (id, index) => {
                let val = personArr[index];
                updatePersonById
                .promise(id, val)
                .then(({ response }) => {
                  // alert(this.t('nTextSavePersonInfoSuccess'));
                })
                .catch(err => {
                  alert(this.t('nTextSavePersonInfoFail'));
                });
              });
            });
          }

          if(departmentIds && departmentIds.length > 0 && _.isFunction(updateOrganizationById)){
            _.forEach(departmentVal, (val, index) => {
              let value = Object.assign({}, val, {parent: id});
              updateOrganizationById
              .promise(departmentIds[index], value)
              .then(({ response }) => {
                // alert(this.t('nTextSaveDepartmentInfoSuccess'));
              })
              .catch(err => {
                alert(this.t('nTextSaveDepartmentInfoFail'));
              });
            });
          }

          alert(this.t('nTextSaveOrganizationInfoSuccess'));
        })
        .catch(err => {
          alert(this.t('nTextSaveOrganizationInfoFail'));
        });
    }
  },

  getStyles() {
    let styles = {
      root: {
        width: global.contentWidth,
        margin: 'auto',
      },
      button: {
        display: 'table',
        margin: '50px auto',
      },
      loadingWrapper: {
        position: 'relative',
        width: '100%',
        minHeight: '800px',
      },
    };

    return styles;
  },

  renderActions() {
    const { renderActions } = this.props;

    const actions = [{
      text: this.t('nTextSave'),
      onTouchTap: this.handleTouchTap,
    }, {
      text: this.t('nTextClose'),
      onTouchTap: this.handleClose,
    }];

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  renderLoading(styles) {
    return (
      <div
        key="loading"
        style={styles.loadingWrapper}
      >
        <Loading style={styles.loading} />
      </div>
    );
  },

  render() {
    const {
      isFetching,
      organization,
    } = this.state;

    let styles = this.getStyles();

    if (isFetching) {
      return this.renderLoading(styles);
    }

    return (
      <div style={styles.root}>
        <OrganizationView
          ref={(ref) => this.form = ref}
          value={organization}
          onUploadFiles={this._handleCheckFiles}
        />
      </div>
    );
  },
});

module.exports = OrganizationForm;
