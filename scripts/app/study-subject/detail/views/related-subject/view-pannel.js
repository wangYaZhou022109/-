var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    courseRelated: true,
    download: false
};

exports.dataForTemplate = {
    courseRelated: function(data) {
        var download = this.bindings.download,
            courseRelated = data.courseRelated;
        _.map(courseRelated, function(opt) {
            var subject = opt;
            if (opt.cover) {
                subject.imageUrl = download.getFullUrl() + '?id=' + opt.cover;
            }
            return subject;
        });
        return courseRelated;
    }
};

exports.events = {
    'click resetPage': 'resetPage'
};

exports.handlers = {
    resetPage: function() {
        this.module.dispatch('turnPage');
    }
};
