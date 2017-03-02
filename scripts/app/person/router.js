exports.routes = {
    archives: 'showArchives',
    train: 'showTrain',
    lecture: 'showLecture'
};

exports.showArchives = function() {
    return this.app.show('content', 'person/archives');
};

exports.showTrain = function(id) {
    return this.app.show('content', 'train/index/', { id: id });
};

exports.showLecture = function() {
    return this.app.show('content', 'person/lecture');
};
