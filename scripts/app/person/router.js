exports.routes = {
    index: 'showIndex',
    train: 'showTrain'
};

exports.showIndex = function() {
    return this.app.show('content', 'person/index');
};

exports.showTrain = function(id) {
    return this.app.show('content', 'train/index/', { id: id });
};
