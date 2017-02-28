var _ = require('lodash/collection');

exports.bindings = {
    trainees: true,
    state: false
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'trainees' }
}];

exports.events = {
    'click checkAll': 'checkAll',
    'click check-item*': 'checkItem'
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
    }
};

exports.actionCallbacks = {
    situation: function() {
        var situation = this.module.items.situation;
        this.app.viewport.modal(situation);
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
