var _ = require('lodash/collection'),
    $ = require('jquery'),
    findExtension;

exports.bindings = {
    all: true,
    approval: true,
    files: true,
    download: false,
    preview: false,
    state: true,
};

exports.events = {
    'click preview-*': 'preview',
};

exports.handlers = {
    viewDesc: function() {
        this.module.dispatch('preview', {
            flag: 'desc'
        });
    },
    preview: function(id) {
        var docUrl = this.bindings.preview.getFullUrl() + '/' + id,
            param = {
                flag: 'doc',
                docUrl: docUrl
            };
        this.module.dispatch('preview', param);
    }
};

exports.actions = {
    'click approval': 'approval'
};

exports.dataForActions = {
    approval: function() {
        var state = this.bindings.state.data,
            taskMemberId = state.id;
        return {
            taskMemberId: taskMemberId,
            score: $(this.$('score')).val(),
            comment: $(this.$('comment')).val(),
            state: $(this.$$('[name="state"]:checked')).val(),
        };
    }
};

exports.dataForTemplate = {
    checked: function(data) {
        var all = data.all;
        return {
            checkedState: all.taskApproval.state === 1,
        };
    },
    files: function(data) {
        var me = this;
        _.map(data.files || [], function(file, i) {
            var item = file,
                extension;
            extension = item.attachmentName.split('.').pop().toLowerCase();
            item.fileType = findExtension.call(me, extension);
            item.downUrl = me.bindings.download.getFullUrl() + '?id=' + item.attachmentId;
            item.i = i + 1;
        });
        return data.files;
    }
};
