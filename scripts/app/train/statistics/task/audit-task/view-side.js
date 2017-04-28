var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    all: true,
    approval: true,
    download: false,
    preview: false,
    state: true,
    mainState: true,
};

exports.events = {
    'click preview-*': 'preview',
    'click explain': 'explain',
    'click description': 'description',
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
        mainState.isDescription = false;
        this.bindings.mainState.changed();
        this.module.dispatch('preview', param);
    },
    explain: function() {
        var mainState = this.bindings.mainState.data;
        mainState.isExplain = true;
        mainState.isDescription = true;
        this.bindings.mainState.changed();
    },
    description: function() {
        var mainState = this.bindings.mainState.data;
        mainState.isExplain = true;
        mainState.isDescription = false;
        this.bindings.mainState.changed();
    },
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
        var all = data.all || {};
        var taskApproval = all.taskApproval || {};
        if (taskApproval.state === 0) {
            return true;
        }
        return false;
    },
    all: function(data) {
        var me = this;
        var all = data.all || {};
        var task = all.task || {};
        var attachs = task.attachList || [];
        all.downUrl = me.bindings.download.getFullUrl() + '?id=' + all.attachmentId;
        _.map(attachs || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            return obj;
        });
        return all;
    }
};
