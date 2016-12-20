var _ = require('lodash/collection');
exports.bindings = {
    subjects: true,
    download: false,
    search: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'subjects' }
}];

exports.dataForTemplate = {
    subjects: function(data) {
        var download = this.bindings.download,
            subjects = data.subjects;
        _.map(subjects, function(opt) {
            var subject = opt;
            if (opt.cover) {
                subject.imageUrl = download.getFullUrl() + '?id=' + opt.cover;
            }
            return subject;
        });
        return subjects;
    }
};

exports.events = {
    'click order-*': 'order'
};

exports.handlers = {
    order: function(id) {
        this.module.dispatch('order', {
            orderBy: id
        });
    }
};
