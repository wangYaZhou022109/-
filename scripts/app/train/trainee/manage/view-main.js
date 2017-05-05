var _ = require('lodash/collection');

exports.bindings = {
    trainees: true,
    state: false,
    auditTrainee: false,
    detail: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'trainees' }
}];

exports.events = {
    'click checkAll': 'checkAll',
    'click check-item*': 'checkItem',
    'click audit*': 'audit',
    'click allAudit': 'auditAll',
    'click detail*': 'detail'
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
        var model = this.module.items.audit;
        this.app.viewport.modal(model, { traineeId: id });
    },
    auditAll: function() {
        var ids = [];
        this.$$('input[name="traineeId"]:checked').forEach(function(x) {
            var element = x || {};
            var id = element.value;
            ids.push(id);
        });
        if (ids.length !== 0) {
            this.app.viewport.modal(this.module.items.audit, { traineeId: ids.join(',') });
        } else {
            this.app.message.alert('请至少选择一位学员！');
        }
    },
    detail: function(data) {
        var id = data,
            trainees = this.bindings.trainees.data,
            view = this.module.items.detail;
        this.bindings.detail.data = _.find(trainees, ['id', id]);
        this.bindings.detail.changed();
        this.app.viewport.modal(view);
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
