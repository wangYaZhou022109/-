
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    myreply: true
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
    // remove: function(data) {
    //     var me = this;
    //     return this.Promise.create(function(resolve) {
    //         var message = '确定要删除该数据?';
    //         me.app.message.confirm(message, function() {
    //             resolve(data);
    //         }, function() {
    //             resolve(false);
    //         });
    //     });
    // },
    // concern: function() {
    // },
    // enjoy: function() {
    // },
    // report: function() {
    // }
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
    myreply: function(data) {
        var trends = data.myreply;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return trends;
    }
};
