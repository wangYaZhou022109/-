exports.routes = {
    index: 'showIndex',
    topicdetail: 'showDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'ask/index');
};

exports.showDetails = function(id) {
    return this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
};
