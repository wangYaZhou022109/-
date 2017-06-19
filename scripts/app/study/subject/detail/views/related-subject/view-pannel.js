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
            } else {
                subject.imageUrl = 'images/default-cover/default_spceial.jpg';
            }
            return subject;
        });
        return courseRelated;
    }
};

exports.events = {
    'click resetPage': 'resetPage',
    'click openDetail-*': 'openDetail'
};

exports.handlers = {
    resetPage: function() {
        this.module.dispatch('turnPage');
    },
    openDetail: function(id) {
        var subject = _.find(this.bindings.courseRelated.data || [], { id: id }),
            url = subject.url || '#/study/subject/detail/' + id;
        window.open(url);
        if (subject.url) this.module.dispatch('register', { id: id });
    }
};
