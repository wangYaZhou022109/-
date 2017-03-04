var _ = require('lodash/collection');
exports.bindings = {
    subjects: true,
    download: false,
    search: true,
    topics: true
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
            } else {
                subject.imageUrl = 'images/default-cover/default_spceial.jpg';
            }
            subject.studyDays = subject.studyDays || '暂无';
            return subject;
        });
        return subjects;
    },
    topics: function(data) {
        var selectId = data.search.topicId;
        var list = data.topics;
        return _.map(list, function(m) {
            var obj = m || {};
            delete obj.active;
            if (selectId === obj.id) obj.active = true;
            return obj;
        });
    }
};

exports.events = {
    'click order-*': 'order',
    'click topic-*': 'selectTopic'
};

exports.handlers = {
    order: function(id) {
        this.module.dispatch('order', {
            orderBy: id
        });
    },
    selectTopic: function(id) {
        var search = this.bindings.search.data,
            param = { topicId: id };
        if (search.topicId === param.topicId) delete param.topicId;
        this.module.dispatch('search', param);
    }
};
