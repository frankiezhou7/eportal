import _ from 'eplodash';
import React, { Component } from 'react';
import AutoStyle from 'epui-auto-style';
import RaisedButton from 'epui-md/RaisedButton';
import Checkbox from 'epui-md/Checkbox';

const PropTypes = React.PropTypes;

class WelcomeSplash extends Component {
  static propTypes = {
    style: PropTypes.object,
    onStart: PropTypes.func,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  getStyles() {
    const { palette } = this.context.muiTheme;
    const { style } = this.props;

    return {
      root: _.assign({

      }, style),
      title: {
        color: palette.accent1Color,
        fontSize: '40px',
        margin: '82px 0px'
      },
      button: {
        root: {
          display: 'block',
          margin: '16px auto',
          height: '65px',
          width: '200px',
        },
        text: {
          fontSize: '32px',
          lineHeight: '65px',
        }
      },
      checkbox: {
        margin: '20px auto',
        width: '220px',
      }
    };
  }

  render() {
    return (
      <div style={this.s('root')}>
        <h1 style={this.s('title')}>Welcome to E-PORTS!</h1>
        <img src={require('./welcome.svg')} />
        <Checkbox
          ref='checkbox'
          style={this.s('checkbox')}
          defaultChecked={true}
          label='show more detailed guides'
        />
        <RaisedButton
          style={this.s('button.root')}
          label={'START'}
          primary={true}
          fullWidth={false}
          labelStyle={this.s('button.text')}
          onTouchTap={this._handleTouchTap}
        />
      </div>
    );
  }

  _handleTouchTap = e => {
    if(!this.props.onStart) { return; }
    this.props.onStart(e, this.refs.checkbox.isChecked());
  };
}


export default AutoStyle(WelcomeSplash);
