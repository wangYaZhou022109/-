var _ = require('lodash/collection');
exports.bindings = {
    courseRelated: true,
    download: false
};

exports.dataForTemplate = {
    courseRelated: function(data) {
        var download = this.bindings.download,
            courseRelated = data.courseRelated;
        _.map(courseRelated, function(opt) {
            var course = opt;
            if (opt.cover) {
                course.imageUrl = download.getFullUrl() + '?id=' + opt.cover;
            }
            return course;
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