exports.routes = {
    index: 'showIndex',
    topicdetail: 'showDetails',
    'expert/index': 'showExpertIndex',
    topicsquare: 'showtopicsquare',
    topic: 'showtopic'

};

exports.showIndex = function() {
    return this.app.show('content', 'ask/index');
};

exports.showDetails = function(id) {
    return this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
};

exports.showExpertIndex = function() {
    return this.app.show('content', 'ask/expert');
};
exports.showtopicsquare = function(id) {
    return this.app.show('content', 'ask/topicsquare', { id: id });
};
exports.showtopic = function(id) {
    return this.app.show('content', 'ask/topic', { id: id });
};

