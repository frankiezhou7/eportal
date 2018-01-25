const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SvgIcon = require('epui-md/SvgIcon');

const IconDeparture = React.createClass({

  mixins: [PureRenderMixin],

  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M-1.35891298e-13,8.65973959e-14 L5.8176186,3.13239379 L3.13239379,5.8176186 L-1.35891298e-13,8.65973959e-14 Z M8.92080477,12 C10.621311,12 11.9998437,10.6214673 11.9998437,8.92096111 C11.9998437,7.22045489 10.621311,5.84192222 8.92080477,5.84192222 C7.22029855,5.84192222 5.84176588,7.22045489 5.84176588,8.92096111 C5.84176588,10.6214673 7.22029855,12 8.92080477,12 Z"></path>
      </SvgIcon>
    );
  }

});

module.exports = IconDeparture;
