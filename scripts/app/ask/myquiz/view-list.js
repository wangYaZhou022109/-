exports.type = 'dynamic';
exports.bindings = {
    params: false,
    questions: true
};

exports.events = {
    'click details-*': 'details',
    'click detailss-*': 'datailss'
};

exports.handlers = {
    details: function(data) {
        var mod = this.module.items['ask-bar/myquiz/details'];
        this.app.viewport.ground(mod, { id: data });
    },
    datailss: function(data) {
        var mod = this.module.items['ask-bar/myquiz/details'];
        this.app.viewport.ground(mod, { id: data });
    }
};

exports.actions = {
    'click remove-*': 'remove',
    'click concern-*': 'concern',
    'click enjoy-*': 'enjoy',
    'click report-*': 'report'
};

exports.dataForActions = {
    remove: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要删除该数据?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    concern: function() {
    },
    enjoy: function() {
    },
    report: function() {
    }
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    }
};

exports.dataForTemplate = {
    questions: function(data) {
        var obj = data,
            date = new Date(data.questions.createTime);
        obj.questions.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + '   ' + date.getHours() + ':' + date.getMinutes();
        return obj.questions;
    }
};
