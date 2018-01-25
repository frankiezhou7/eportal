const _ = require('eplodash');
const Base = require('./Base');
const domain = require('../domain');
const BasePageable = require('./BasePageable');

class Feedbacks extends BasePageable {
  constructor() { super(); }

  $setOrderFeedback(feedback) {
    const pagination = feedback && feedback.pagination;
    const cursor = pagination && pagination.cursor;
    const size = pagination && pagination.size;
    const firstPage = cursor <= size;


    return firstPage ? domain.create('Feedbacks', feedback) : this.concat(feedback);
  }

  $replyFeedback(feedback) {
    feedback = this.domain.create('Feedback', feedback);
    let feedbacks = this.asMutable();
    let entries = feedbacks.entries;

    let merged = feedbacks.entries.map(function(entry) {
      if(entry._id === feedback._id) {
        return feedback;
      }else {
        return entry.asImmutable();
      }
    });

    feedbacks.set('entries', merged)

    return feedbacks.asImmutable();
  }

  $pubFeedback(feedback) {
    return this.unshift(feedback)
  }


}
Feedbacks.modelName = 'Feedbacks';
Feedbacks.ENTRY_TYPE = 'Feedback';

module.exports = Feedbacks;
