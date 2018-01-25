let React = require('react');
let Translatable = require('epui-intl');

let PropTypes = React.PropTypes;

let PortMixin = {
  mixins: [Translatable],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object
  },

  propTypes: {
    port: PropTypes.object
  },

  getDefaultProps() {
    return {
      port: null
    };
  },

  setTitle(title) {
    if(title) {
      document.title = title;
      return;
    }

    let name = this.portName ? this.portName + '/' : '';
    let router = this.context.router;
    let path = router.getCurrentPathname();

    let res = /\/([^/]*)$/.exec(path);
    let titles = {
      'voyages': `${name}${this.t('nTitlePortVoyages')} - `,
      'particulars': `${name}${this.t('nTitlePortParticulars')} - `,
      'logs': `${name}${this.t('nTitlePortLogs')} - `,
      'reports': `${name}${this.t('nTitlePortReports')} - `,
    };
    document.title = (titles[res[1]] || '') + this.t('nTitleGlobalPostfix');
  },

  componentWillMount() {
    this._defineProp('portId', () => {
      if(!this.props.port) { return null; }
      return this.props.port._id;
    });

    this._defineProp('portName', () => {
      if(!this.props.port) { return null; }
      return this.props.port.portName;
    });
  },

  _defineProp(name, getter) {
    Object.defineProperty(this, name, {
      get: getter
    });
  }
};

module.exports = PortMixin;
