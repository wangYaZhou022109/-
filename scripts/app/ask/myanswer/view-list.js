var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    myreply: true,
    page: true
};

exports.events = {
    'click myquiz-details-*': 'showDetails'
};

exports.handlers = {
    showDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
        }
    }
};

exports.actions = {
    'click remove-*': 'remove',
};

exports.dataForActions = {
    remove: function(payload) {
        var data = payload;
        data.auditType = '3';
        return data;
    }
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    }
};

exports.dataForTemplate = {
    // myreply: function(data) {
    //     var trends = data.myreply;
    //     _.forEach(trends, function(value) {
    //         var obj = value,
    //             date = new Date(obj.createTime);
    //         obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    //         + '   ' + date.getHours() + ':' + date.getMinutes();
    //     });
    //     return trends;
    // },
    page: function(data) {
        var trends = data.myreply;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.questionDiscuss.createTime);
            obj.questionDiscuss.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
            _.forEach(me.bindings.page.data, function(v) {
                if (v.id === obj.questionDiscuss.id) {
                    flag = false;
                }
            });
            if (flag) {
                page.push(obj);
            }
        });
        return page;
    }
};

exports.beforeClose = function() {
    $(window).unbind('scroll');
};
