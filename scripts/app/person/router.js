exports.routes = {
    index: 'showIndex',
    response: 'showResponse',
    train: 'showTrain'
};

exports.showIndex = function() {
    return this.app.show('content', 'person/index');
};

exports.showResponse = function() {
    return this.app.show('content', 'person/response');
};

exports.showTrain = function(id) {
    return this.app.show('content', 'train/index/', { id: id });
};
