const React = require('react');
const _ = require('eplodash');

const FAQItem = require('./faq-item');

const PropTypes = React.PropTypes;

const FAQPage = React.createClass({

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.object,
  },

  render() {
    const title = 'FAQ';
     const faqItems = this.props.value;
     const content = _.map(faqItems, (faqItem, index) => {
       return (
         <FAQItem
          index={index}
          question={faqItem.question}
          answers={faqItem.answers}
         />
       )
     });

    return (
      <div
        style={this.props.style.root}
      >
        <h1
          style={this.props.style.title}
        >
          {title}
        </h1>
        <div
          style={this.props.style.content}
        >
          {content}
        </div>
      </div>
    )
  }

})

module.exports = FAQPage;
