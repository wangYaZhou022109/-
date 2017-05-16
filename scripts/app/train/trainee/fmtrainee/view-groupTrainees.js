var _ = require('lodash/collection');
var $ = require('jquery');

exports.title = '分组学员详情';

exports.bindings = {
    groupTrainees: true,
    exportGroupTrainee: true
};

exports.auto = true;

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'groupTrainees' }
}];

exports.events = {
    'click group-trainee-sort*': 'showSortInput',
    'change group-trainee-input-sort*': 'updateSort'
};

exports.actions = {
    'click group-trainee-delete*': 'deleteTraineeGroup'
};

exports.dataForActions = {
    deleteTraineeGroup: function(payload) {
        var groupTrainees = this.bindings.groupTrainees.data;
        groupTrainees = _.filter(groupTrainees, function(t) {
            return t.id !== payload.id;
        });
        this.bindings.groupTrainees.data = groupTrainees;
        this.bindings.groupTrainees.changed();
        return payload;
    }
};

exports.actionCallbacks = {
    deleteTraineeGroup: function(data) {
        if (data[0]) {
            this.app.message.success('移除成功！');
        } else {
            this.app.message.error('移除失败！');
        }
    }
};

exports.handlers = {
    showSortInput: function(id) {
        $(this.$('group-trainee-input-sort' + id)).css('display', 'block');
        $(this.$('group-trainee-sort' + id)).css('display', 'none');
        $(this.$('group-trainee-delete' + id)).css('display', 'none');
        $(this.$('groupshuxian' + id)).css('display', 'none');
    },
    updateSort: function(id) {
        var me = this;
        var data = {};
        var val = $(this.$('group-trainee-input-sort' + id)).val().trim();
        if (isNaN(val) || val === '') {
            this.app.message.alert('请输入正整数！');
        } else {
            data.id = id;
            data.sortForGroup = val;
            me.module.dispatch('updateSort', data).then(function() {
                me.module.dispatch('groupTrainees');
            });
        }
        $(this.$('group-trainee-input-sort' + id)).css('display', 'none');
        $(this.$('group-trainee-sort' + id)).css('display', 'inline');
        $(this.$('group-trainee-delete' + id)).css('display', 'inline');
        $(this.$('groupshuxian' + id)).css('display', 'inline');
    }
};

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var groupTrainees = data.groupTrainees,
            pageNum = this.bindings.groupTrainees.getPageInfo().page;
        _.map(groupTrainees || [], function(gt, i) {
            var e = gt;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return groupTrainees;
    },
    exportGroupUrl: function() {
        var url = this.bindings.exportGroupTrainee.getFullUrl() + '?';
        var params = this.bindings.groupTrainees.params;
        var token = this.app.global.OAuth.token.access_token;
        params.pageSize = 100000;
        params.page = 1;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        url += ('access_token=' + token);
        return url;
    }
};


exports.beforeClose = function() {
    this.renderOptions.callback();
};
