const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Header = require('./header');
const React = require('react');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const AccountView = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ChangePassword/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.object,
    target: PropTypes.string,
  },

  getDefaultProps() {
    return { };
  },

  getStyles() {
    let {target} = this.props;
    let hasImageArr = ['account-management','user-profile','change-password'];
    return {
      root: {
        height: '100%',
        paddingTop: global.appHeight,
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundImage: `url('${require('~/src/shared/pic/background.svg')}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 100%',
        backgroundColor: '#f0f0f0',
        overflowY: 'auto',
      },
      appBar: {
        position: 'fixed',
        top: 0,
      },
      coverContent: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 2,
        marginTop: 30,
      },
      content: {
        margin: 'auto',
        maxWidth: global.contentWidth,
        height: '100%',
      },
    };
  },

  render() {
    const { target } = this.props;
    return (
      <div style={this.s('root')}>
        <Header
          style={this.s('appBar')}
          target={this._getTranslation(target)}
        />
          <div style = {this.s('content')}>
            {React.cloneElement(this.props.children, {...this.props})}
          </div>
      </div>
    );
  },

  _getTranslation(){
    let { target } = this.props;
    if(!target) return;
    let label = _.reduce(_.split(target,'-'),(init,value)=>{
      return init + _.capitalize(value);
    },'nText');
    return this.t(label);
  },

});

module.exports = AccountView;
