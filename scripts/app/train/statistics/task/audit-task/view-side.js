var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    all: true,
    approval: true,
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
    // checked: function(data) {
    //     var taskApproval = data.all.approval;
    //     return {
    //         checkedState: taskApproval.state === 0,
    //     };
    // },
    all: function(data) {
        var me = this;
        var all = data.all;
        var attachs = data.all.task.attachList || [];
        _.map(attachs || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            return obj;
        });
        return all;
    }
};
