const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const FAQItem = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Faq/${__LOCALE__}`),

  propTypes: {
    index: PropTypes.number,
    question: PropTypes.string,
    answers: PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      show:false,
    };
  },

  getStyles() {
    let styles = {
      title: {
        textAlign : 'left',
        marginTop: '8px',
        fontSize: 20,
        fontWeight: 500,
        cursor: 'pointer',
      },
      answer: {
        display: this.state.show ? 'block' : 'none',
      },
      text:{
        textAlign : 'left',
        textIndent: '2em',
        margin : '8px 0px',
        fontSize: 15,
      },
      image:{
        textAlign : 'left',
        margin:'5px 0px',
        overflow:'hidden',
      }
    };

    return styles;
  },

  render() {
    const renderAnswers = this.props.answers.map(answer => {
      if(answer.type === 'text') {
        const text = this.t(answer.content);
        return (
          <div style={this.style('text')} >
            {text}
          </div>
        );
      }else if(answer.type === 'img') {
        const url = answer.content;
        return (
          <img
            style={this.style('image')}
            width='100%'
            height='100%'
            src={url}
           />
        );
      }
    });
    const title = `${this.props.index + 1}. ${this.t(this.props.question)}`;
    const renderTitle = (
      <div
        style={this.style('title')}
        onClick={this._handleClickQuestion}
      >
        {title}
      </div>
    );

    return (
      <div>
        {renderTitle}
        <div style={this.style('answer')}>
          {renderAnswers}
        </div>
      </div>
    );
  },

  _handleClickQuestion() {
    this.setState({
      show:!this.state.show,
    })
  },

});

module.exports = FAQItem;
