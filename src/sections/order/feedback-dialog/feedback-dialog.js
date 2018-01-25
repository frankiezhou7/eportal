const React = require('react');
const _ = require('eplodash');
const StylePropable = require('~/src/mixins/style-propable');
const FlexibleTextBox = require('epui-md/ep/FlexibleTextBox');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const Message = require('./message');

const PAGE_SIZE = 5;
const PAGE_SORT = {
  'dateCreate': -1,
};

const PropTypes = React.PropTypes;

const FeedbackDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [require(`epui-intl/dist/Feedback/${__LOCALE__}`)],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    nTextClose: PropTypes.string,
    nTextSend: PropTypes.string,
    nTextFeedbackPlaceholder: PropTypes.string,
    nTextNoMessage: PropTypes.string,
    nTextMore: PropTypes.string,
    user: PropTypes.object,
    feedbacks: PropTypes.object,
    pubFeedback: PropTypes.func,
    findOrderFeedback: PropTypes.func,
    replyFeedback: PropTypes.func,
    selectOrderID: PropTypes.string,
    close: PropTypes. func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {

    };
  },

  getStyles() {
    let styles = {
      root: {

      },
      textBox: {
        marginTop: '5px',
        marginBottom: '56px',
      },
      message: {
        paddingTop: '24px',
        paddingBottom: '24px',
        borderBottom:'1px solid #d0d0d0',
      },
      more: {
        cursor: 'pointer',
        display: 'block',
        textAlign: 'center',
        margin: '40px auto 0 auto',
        fontSize: '16px',
        color: '#f5a623',
        lineHeight: '16px',
      }
    };

    return styles;
  },

  componentWillMount() {
    let {
      selectOrderID,
      findOrderFeedback
    } = this.props;
    if(selectOrderID) {
      let pagination;
      pagination = {
        query: {
          order: selectOrderID,
        },
        size: PAGE_SIZE,
        sortby: PAGE_SORT,
      }
      if (_.isFunction(findOrderFeedback)) {
        findOrderFeedback(pagination);
      }
    };
  },

  componentWillReceiveProps(nextProps) {
    let  nextSelectOrderID = nextProps.selectOrderID;
    let {
      selectOrderID,
      findOrderFeedback
    } = this.props;

    if(nextSelectOrderID !== selectOrderID) {
      let pagination;
      pagination = {
        query: {
          order: nextSelectOrderID,
        },
        size: PAGE_SIZE,
        sortby: PAGE_SORT,
      }

      if (_.isFunction(findOrderFeedback)) {
        findOrderFeedback(pagination);
      }
    };
  },

  componentDidMount() {
    let actions = [
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />
    ];

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  componentDidUpdate() {
    if(this.props.positionDialog) {this.props.positionDialog()};
  },


  render() {

    let { feedbacks } = this.props;
    feedbacks = feedbacks && feedbacks.get('entries') && feedbacks.get('entries').toJS();

    const pubFeedback = (
      <FlexibleTextBox
        ref="flexibleTextBox"
        label={this.t('nTextSend')}
        placeholder={this.t('nTextFeedbackPlaceholder')}
        initiallyOpen={true}
        keepOpen={true}
        style={this.style('textBox')}
        onTouchTap={this._handleClickAddFeedback}
      />
    )

    const elFeedbacks = feedbacks && feedbacks.length > 0 ? _.map(feedbacks, (item) => {
      return (
        <Message
          key = {item._id}
          style={this.style('message')}
          feedback={item}
          replyFeedback={this._handleClickReply}
          positionDialog={this.props.positionDialog}
        />
      );
    }) : this.t('nTextNoMessage');

    const elFetchMore = (
      <span
        style={this.style('more')}
        onMouseDown={this._handleFetchMore}
      >
        {this.t('nTextMore')}
      </span>
    )

    return this._isLoading() ? <Loading /> : (
      <div>
        {pubFeedback}
        <div
          ref='content'
          style={this.style('content')}
        >
          {elFeedbacks}
        </div>
        {this._hasMore() && elFetchMore}
      </div>
    )
  },

  _isLoading() {
    let feedbacks = this.props.feedbacks;
    let loading = !!(feedbacks && feedbacks.getMeta('loading'));

    return loading;
  },

  _hasMore() {
    let feedbacks = this.props.feedbacks;
    let pagination = feedbacks && feedbacks.get('pagination');
    let hasNext = pagination && pagination.get('hasNext');

    return !!hasNext;
  },

  _handleFetchMore() {
    let {
      selectOrderID,
      findOrderFeedback,
      feedbacks
    } = this.props;

    let pagination = feedbacks && feedbacks.get('pagination');

    if (!pagination) { return; }
    let cursor = pagination.get('cursor');
    if (!cursor) { return; }

    let newPagination;

    newPagination = {
      query: {
        order: selectOrderID,
      },
      size: PAGE_SIZE,
      sortby: PAGE_SORT,
      cursor: cursor,
    };
    if (_.isFunction(findOrderFeedback)) {
      findOrderFeedback(newPagination);
    }
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleClickReply(id, value) {
    let {
      user,
      replyFeedback
     } = this.props;

     let reply = {
       user: user._id,
       content: value,
       dateCreate: new Date()
     };

    if(_.isFunction(replyFeedback)) {
      replyFeedback(id, reply)
    }
  },

  _handleClickAddFeedback(value) {
    let {
      user,
      selectOrderID,
      pubFeedback
    } = this.props;

    let feedback = {
      order: selectOrderID,
      user: user._id,
      content: value.value,
    }

    if(_.isFunction(pubFeedback)) {
      pubFeedback(feedback)
    }

    let textBox = this.refs.flexibleTextBox;
    let fn = textBox.resetValue;
    if(_.isFunction(fn)) {
      fn();
    }
  }
});

module.exports = FeedbackDialog;
