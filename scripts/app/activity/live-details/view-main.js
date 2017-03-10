var _ = require('lodash/collection');

exports.bindings = {
    gensee: true,
    courses: true,
    down: true,
    sub: true
};

exports.events = {
};

exports.handlers = {
};

exports.actions = {
    'click sub-*': 'subGensee',
};

exports.dataForActions = {
    subGensee: function(data) {
        return this.Promise.create(function(resolve) {
            resolve(data);
        });
    },

};

exports.dataForTemplate = {
    relatedGensee: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        var defultImg = 'images/default-cover/default_live.jpg';
        _.map(data.gensee.relatedGensee || [], function(item) {
            var info = item;
            info.cover = info.cover ? (downUrl + '?id=' + info.cover) : defultImg;
        });
        return data.gensee.relatedGensee;
    },
    gensee: function(data) {
        var info = data.gensee,
            lecturers = info.lecturers,
            nameArray = [];
        if (lecturers) {
            nameArray = _.map(lecturers, function(item) {
                return item.lecturerName;
            });
            info.lecturerStr = nameArray.join(',');
        }
        return data.gensee;
    },
    courses: function(data) {
        var defultImg = 'images/default-cover/default_course.jpg',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.courses || [], function(item) {
            var info = item;
            info.cover = info.cover ? (downUrl + '?id=' + info.cover) : defultImg;
        });
        return data.courses;
    },
};

