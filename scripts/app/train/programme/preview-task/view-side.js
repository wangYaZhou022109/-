var _ = require('lodash/collection');

exports.bindings = {
    task: true,
    preview: false,
    mainState: true,
    download: false,
};

exports.events = {
    'click preview-*': 'preview',
    'click explain': 'explain',
};

exports.handlers = {
    preview: function(id) {
        var mainState = this.bindings.mainState.data;
        var docUrl = this.bindings.preview.getFullUrl() + '/' + id,
            param = {
                flag: 'doc',
                docUrl: docUrl
            };
        mainState.isExplain = false;
        this.bindings.mainState.changed();
        this.module.dispatch('preview', param);
    },
    explain: function() {
        var mainState = this.bindings.mainState.data;
        mainState.isExplain = true;
        this.bindings.mainState.changed();
    },
};

exports.dataForTemplate = {
    task: function(data) {
        var me = this;
        var task = data.task || {};
        var attachs = task.attachList || [];
        _.map(attachs || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            return obj;
        });
        return task;
    }
};
