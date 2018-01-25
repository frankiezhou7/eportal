const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SvgIcon = require('epui-md/SvgIcon');

const IconArrival = React.createClass({

  mixins: [PureRenderMixin],

  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M5.80803985,5.47556086 L11.4762125,8.52765385 L8.86013284,11.1437336 L5.80803985,5.47556086 Z M3,6 C4.65685425,6 6,4.65685425 6,3 C6,1.34314575 4.65685425,0 3,0 C1.34314575,0 0,1.34314575 0,3 C0,4.65685425 1.34314575,6 3,6 Z M3,5 C4.1045695,5 5,4.1045695 5,3 C5,1.8954305 4.1045695,1 3,1 C1.8954305,1 1,1.8954305 1,3 C1,4.1045695 1.8954305,5 3,5 Z"></path>
      </SvgIcon>
    );
  }

});

module.exports = IconArrival;
