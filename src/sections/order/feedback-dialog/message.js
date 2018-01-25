const React = require('react');
const _ = require('eplodash');
const FlexibleTextBox = require('epui-md/ep/FlexibleTextBox');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const Reply = require('./reply');

const Message = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [require(`epui-intl/dist/Feedback/${__LOCALE__}`)],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    positionDialog: PropTypes.func,
    nTextReply: PropTypes.string,
    nTextSend: PropTypes.string,
    nTextFeedbackPlaceholder: PropTypes.string,
    feedback: PropTypes.object,
    style: PropTypes.object,
    replyFeedback: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {
      showTextfield: false,
    };
  },

  componentDidUpdate() {
    if(this.props.positionDialog) {this.props.positionDialog()};
  },

  getStyles() {
    let { style } = this.props;
    let styles = {
      root: {
      },
      header: {
        root: {
          verticalAlign: 'top',
          width: '75px',
          display: 'inline-block',
        },
        icon: {
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '50%',
          background: '#9b9b9b',
          width: '36px',
          height: '36px',
        },
        name: {
          fontSize: '12px',
          color: '#4a4a4a',
          textAlign:'center',
        }
      },
      content: {
        root: {
          paddingLeft: '3px',
          verticalAlign: 'top',
          fontSize: '16px',
          width: 'calc(100% - 78px)',
          display: 'inline-block',
        },
        footer: {
          marginTop: '14px',
        },
        date: {
          color: '#9b9b9b',
          lineHeight: '16px',
          marginRight: '18px',
          fontWeight: 300,
        },
        response: {
          color: '#f5a623',
          lineHeight: '16px',
          fontWeight: 300,
          cursor: 'pointer'
        }
      },
      replies: {
        root: {
          marginLeft: '75px',
        },
        reply: {
          marginTop: '24px',
          paddingTop: '24px',
          borderTop:'1px dashed #d0d0d0',

        }
      },
      textBox: {
        marginTop: '24px',
      },
    };

    styles.root = _.merge(styles.root, style);
    return styles;
  },

  renderheader(user) {
    let {
      name,
      photoURL
    } = user;

    if(name) {
      name = name.givenName ? `${name.givenName} ${name.surname}` : `${name.surname}`;
    }

    return (
      <div
        style={this.style('header.root')}
      >
        <img
          style={this.style('header.icon')}
          src={photoURL}
        />
      <div style={this.style('header.name')}>{name}</div>
      </div>
    )
  },

  renderContent(feedback) {
    let {
      content,
      dateCreate,
    } = feedback;

    const date = new Date(dateCreate);
    dateCreate = moment(date).format('MM/DD/YYYY HH:mm');
    let textfield = this.state.showTextfield ? (
      <FlexibleTextBox
        ref="textBox"
        showCloseButton={true}
        labelClose={this.t('nTextClose')}
        label={this.t('nTextSend')}
        placeholder={this.t('nTextFeedbackPlaceholder')}
        initiallyOpen={true}
        keepOpen={true}
        showDate={false}
        style={this.style('textBox')}
        onTouchTap={this._handleClickSend}
        onTouchTapClose={this._handleClickClose}
      />
    ) : null;

    return (
      <div
        style={this.style('content.root')}
      >
        {content}
        <div
          style={this.style('content.footer')}
        >
          <span style={this.style('content.date')}>{dateCreate}</span>
          <span
            style={this.style('content.response')}
            onClick = {this._handleClickReply}
          >
            {this.t('nTextReply')}
          </span>
        </div>
        {textfield}
      </div>
    )
  },

  renderReplies(replies) {
    let { feedback } = this.props;

    const elReplies = _.map(replies, (reply) => {
      return (
        <Reply
          key = {reply._id}
          style={this.style('replies.reply')}
          reply={reply}
          positionDialog={this.props.positionDialog}
          handleClickSend={this._handleClickSend}
        />
      )
    })
    return (
      <div
        style={this.style('replies.root')}
      >
        {elReplies}
      </div>
    )
  },

  render() {
    const {
      feedback
    } = this.props;

    let replies = feedback.replies;

    let header = this.renderheader(feedback.user);
    let content = this.renderContent(feedback);
    replies = replies && replies.length > 0 && this.renderReplies(replies)

    return (
      <div
        style={this.style('root')}
      >
        {header}
        {content}
        {replies}
      </div>
    )
  },

  _handleClickReply() {
    this.setState({
      showTextfield: true,
    },function() {
      let textBox = this.refs.textBox;
      let fn = textBox.onFocus;
      if(_.isFunction(fn)) {
        fn();
      }
    })
  },

  _handleClickSend(value) {
    let fn = this.props.replyFeedback;
    let { feedback } = this.props;
    let id = feedback && feedback._id;

    if(_.isFunction(fn)) {
      fn(id, value);
    };

    if(this.state.showTextfield) {
      this.setState({
        showTextfield: false,
      })
    }
  },

  _handleClickClose() {
    this.setState({
      showTextfield: false
    })
  }

})

module.exports = Message;
