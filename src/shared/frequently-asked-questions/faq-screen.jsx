const React = require('react');
const _ = require('eplodash');
const FAQPage = require('./faq-page');
const FAQHeader = require('./faq-header');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const ScreenMixin = require('~/src/mixins/screen');

const PropTypes = React.PropTypes;

const defaultValue = [
  {
    question:'nTextQuestion1',
    answers:[
      {
        type:'text',
        content:'nTextAnswer1Line1',
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer1-img1.png`),
      },
      {
        type:'text',
        content:'nTextAnswer1Line2'
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer1-img2.png`),
      },
    ],
  },
  {
    question:'nTextQuestion2',
    answers:[
      {
        type:'text',
        content:'nTextAnswer2Line1'
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer2-img1.png`),
      },
      {
        type:'text',
        content:'nTextAnswer2Line2'
      },
    ],
  },
  {
    question:'nTextQuestion3',
    answers:[
      {
        type:'text',
        content:'nTextAnswer3Line1'
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer3-img1.png`),
      },
    ],
  },
  {
    question:'nTextQuestion4',
    answers:[
      {
        type:'text',
        content:'nTextAnswer4Line1'
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer4-img1.png`),
      },
      {
        type:'text',
        content:'nTextAnswer4Line2'
      },
    ],
  },
  {
    question:'nTextQuestion5',
    answers:[
      {
        type:'text',
        content:'nTextAnswer5Line1'
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer5-img1.png`),
      },
      {
        type:'text',
        content:'nTextAnswer5Line2'
      },
    ],
  },
  {
    question:'nTextQuestion6',
    answers:[
      {
        type:'text',
        content:'nTextAnswer6Line1'
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer6-img1.png`),
      },
      {
        type:'img',
        content: require(`~/src/statics/${__LOCALE__}/css/faq/faq-answer6-img2.png`),
      },
    ],
  },
  {
    question:'nTextQuestion7',
    answers:[
      {
        type:'text',
        content:'nTextAnswer7Line1'
      },
    ],
  },
]

const FAQScreen = React.createClass({
  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: [
    require(`epui-intl/dist/Faq/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextFaq'));
  },

  getStyles() {
    let styles = {
      root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        minWidth: '320px',
        minHeight: '450px',
        overflowY: 'auto',
      },
      page: {
        root: {
          margin: '50px auto',
          width: '900px',
          overflowY: 'auto',
        },
        title:{
          textAlign: 'center',
          fontWeight: 'normal',
          fontFamily: 'Cambria',
          marginTop:'60px',
        },
        content:{
          margin:'20px auto',
        },
      },
    };
    return styles;
  },

  render() {
    let styles = this.getStyles();

    return (
      <div>
        <FAQHeader/>
        <div
          style={this.style('root')}
        >
          <FAQPage
            style={this.style('page')}
            value={defaultValue}
          />
        </div>
      </div>
    );
  },
})

module.exports = FAQScreen;
