var _ = require('lodash/collection');

exports.bindings = {
    gensee: true,
    courses: true,
    down: true,
    sub: true,
    collect: true,
};

exports.events = {
};

exports.handlers = {
};

exports.actions = {
    'click sub-*': 'subGensee',
    'click cancelsub-*': 'cancelsubGensee',
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect',
};

exports.dataForActions = {
    subGensee: function(data) {
        return this.Promise.create(function(resolve) {
            resolve(data);
        });
    },
    cancelsubGensee: function(data) {
        var d = this.Promise.create(function(resolve) {
            resolve(data);
        });
        return d;
    },
    collect: function() {
        var gensee = this.bindings.gensee.data;
        return {
            businessId: gensee.id,
            businessType: 5,
            collectName: gensee.subject
        };
    },
    cancelCollect: function(payload) {
        return payload;
    }

};

exports.actionCallbacks = {
    collect: function() {
        this.app.message.success('收藏成功');
    },
    cancelCollect: function() {
        this.app.message.success('取消收藏成功');
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

