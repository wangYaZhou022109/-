var _ = require('lodash/collection');

exports.bindings = {
    knowledge: true,
    download: false,
    recommends: true,
    integral: true,
    readerMembers: true,
    downCount: false
};
exports.dataForTemplate = {
    downUrl: function(data) {
        return this.bindings.download.getFullUrl() + '?id=' + data.knowledge.resourceId;
    },
    readerMembers: function(data) {
        var dir = this.bindings.download.getFullUrl() + '?id=';
        return _.map(data.readerMembers, function(obj) {
            var member = obj || {},
                src = 'images/d1.jpg';
            if (member.head) {
                src = dir + member.head;
            }
            member.head = src;
            return member;
        });
    }
};
exports.actions = {
    'click changeRecommends': 'changeRecommends'
};

exports.events = {
    'click upload': 'showUpload',
    'click download': 'download'
};

exports.handlers = {
    showUpload: function() {
        var model = this.module.items['knowledge/index/modal'];
        this.app.viewport.modal(model);
    },
    download: function() {
        var url = this.bindings.download.getFullUrl() + '?id=' + this.bindings.knowledge.data.resourceId;
        this.module.dispatch('downCount', function() {
            window.location.href = url;
        });
    }
};
