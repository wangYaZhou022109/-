var D = require('drizzlejs');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    myreply: true
};

exports.events = {
    'click myshares-details-*': 'toggleMore'
};

exports.handlers = {
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/myreply/mydetail', { id: id });
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

