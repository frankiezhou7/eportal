import React, { Component } from 'react'
import Router from 'react-router'
import AppCanvas from 'epui-md/AppCanvas'
import BlueRawTheme from '~/src/styles/raw-themes/blue-raw-theme'
import DialogGenerator from './dialog-generator'
import InfoStack from './info-stack'
import LeftNav from './left-nav'
import RightNav from './right-nav'
import ThemeManager from '~/src/styles/theme-manager'
import Translatable from 'epui-intl'
import { FocusGuidesContainer } from 'epui-guides';

require('epui-intl/lib/locales/' + __LOCALE__);

global.GUIDES = require('~/src/app/guides');

const PropTypes = React.PropTypes;

class Master extends Component {
  static propTypes = {
    children: PropTypes.element,
  };

  static defaultProps = { locale: __LOCALE__ };

  static contextTypes = {
    router: PropTypes.object,
  };

  static childContextTypes = {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  }

  componentWillMount() {
    global.GUIDES.setUpdater(this.forceUpdate.bind(this));
  }

  render() {
    this._loadConfig();

    const showGuide = global.GUIDES.isVisible() && global.GUIDES.isLoaded();
    const guidesConfig = global.GUIDES.getConfig();

    return (
      <AppCanvas>
        <FocusGuidesContainer
          hide={!showGuide}
          config={guidesConfig}
          onChange={this._handleGuidesChange}
        >
          <div style={{height:'100%'}}>
            <DialogGenerator />
            <InfoStack />
            <LeftNav />
            <RightNav />
            {this.props.children}
          </div>
        </FocusGuidesContainer>
      </AppCanvas>
    );
  }

  _handleGuidesChange = (ref, node) => {
    if(!node) { return; }
    const { name } = node;
    global.GUIDES.switchElement(name, false);
  };

  _loadConfig() {
    const guides = global.GUIDES;
    if(!guides.isVisible() || guides.isLoading() || guides.isLoaded()) { return; }
    guides.loadConfig();
  }
}

export default Translatable(Master, [
  require(`epui-intl/dist/Global/${__LOCALE__}`),
  require(`epui-intl/dist/Common/${__LOCALE__}`),
]);
