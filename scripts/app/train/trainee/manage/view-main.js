var _ = require('lodash/collection');

exports.bindings = {
    trainees: true,
    state: false,
    auditTrainee: false,
    auditAll: false
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'trainees' }
}];

exports.events = {
    'click checkAll': 'checkAll',
    'click check-item*': 'checkItem',
    'click audit*': 'audit',
    'click allAudit': 'auditAll'
};

exports.actions = {
    'click situation': 'situation'
};

exports.handlers = {
    checkAll: function(events, obj) {
        this.$$('input[name="traineeId"]').forEach(function(x) {
            var element = x || {};
            element.checked = obj.checked;
        });
    },
    checkItem: function() {
        var flag = this.$$('input[name="traineeId"]').length === this.$$('input[name="traineeId"]:checked').length;
        this.$('checkAll').checked = flag;
    },
    audit: function(id) {
        var model = this.module.items.audit,
            auditTrainee = this.bindings.auditTrainee;
        auditTrainee.data.id = id;
        this.app.viewport.modal(model);
    },
    auditAll: function() {
        var data = {};
        var ids = [];
        var auditAll = this.bindings.auditAll;
        this.$$('input[name="traineeId"]:checked').forEach(function(x) {
            var element = x || {};
            var id = element.value;
            ids.push(id);
        });
        data.ids = ids.join(',');
        auditAll.data = data;
        if (data.ids) {
            this.app.viewport.modal(this.module.items.auditAll);
        } else {
            this.app.message.error('请至少选择一位学员！');
        }
    }
};

exports.actionCallbacks = {
    situation: function(data) {
        var situation = this.module.items.situation;
        if (data[0]) {
            this.app.viewport.modal(situation);
        } else {
            this.app.message.alert('尚未配额！');
        }
    }
};

exports.dataForTemplate = {
    trainees: function(data) {
        var trainees = data.trainees,
            pageNum = this.bindings.trainees.getPageInfo().page;
        _.map(trainees || [], function(trainee, i) {
            var e = trainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return trainees;
    }
};
