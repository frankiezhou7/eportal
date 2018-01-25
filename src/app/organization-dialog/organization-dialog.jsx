const React = require('react');
const Organization = require('~/src/sections/organization');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const OrganizationDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/OrganizationDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    organizationId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      organizationId: ''
    };
  },


  getInitialState() {
    return {
      organization: {},
      isFetching:true,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  componentWillMount() {
    this.fetchOrganization();
  },


  componentDidMount() {
    let actions = [
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />,
    ];

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  fetchOrganization() {
    if (global.api.epds && global.api.epds.findOrganizationById) {
      global.api.epds.findOrganizationById.promise(this.props.organizationId).then((res) => {
        if (res.status === 'OK') {
          this.setState({
            isFetching: false,
            organization: res.response
          }, () => {
            if (this.props.positionDialog)
              this.props.positionDialog();
            }
          );
        } else {
          //todo: deal with error
        }
      }).catch(err => {
        //todo: deal with err
      });
    }
  },

  render() {
    return this.state.isFunction ? <Loading /> : (
      <Organization
        ref="form"
        organization = {this.state.organization}
      />
    );
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

});

module.exports = OrganizationDialog;
