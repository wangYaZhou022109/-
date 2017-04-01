// var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    all: true,
    approval: true,
    download: false,
    preview: false,
    state: true,
};

exports.events = {
    'click preview-*': 'preview',
    'click submit': 'submit',
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
    all: function(data) {
        var all = data.all;
        return all;
    },
    // checked: function(data) {
    //     var all = data.all;
    //     console.log(all);
    //     return {
    //         checkedState: all.taskApproval.state === 0,
    //     };
    // },
};
