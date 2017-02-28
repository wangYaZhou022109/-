var _ = require('lodash/collection');

exports.bindings = {
    fmtrainees: true,
    state: true
};

exports.events = {
    'click addTrainee': 'showMembers'
};

exports.actions = {
    'click agree*': 'agree',
    'click refuse*': 'refuse',
    'click sort*': 'sort',
    'click delete*': 'delete'
};

exports.handlers = {
    showMembers: function() {
        var me = this,
            model = me.module.items['train/trainee/fmtrainee/select-member'];
        me.app.viewport.modal(model, {
            callback: function() {
            }
        });
    }
};

exports.dataForActions = {
    agree: function(payload) {
        var data = payload;
        data.auditStatus = 1;
        return data;
    },
    refuse: function(payload) {
        var data = payload;
        data.auditStatus = 2;
        return data;
    }
};

exports.actionCallbacks = {
    agree: function() {
        var classId = this.bindings.state.data;
        this.app.message.success('审核成功!');
        this.module.dispatch('init', classId);
    },
    refuse: function() {
        var classId = this.bindings.state.data;
        this.app.message.success('审核成功!');
        this.module.dispatch('init', classId);
    }
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'fmtrainees' }
}];

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var fmtrainees = data.fmtrainees,
            pageNum = this.bindings.fmtrainees.getPageInfo().page;
        fmtrainees.isGroup = false;
        _.forEach(fmtrainees, function(f) {
            if (f.traineeGroup.id) {
                fmtrainees.isGroup = true;
            }
        });
        _.map(fmtrainees || [], function(fmtrainee, i) {
            var e = fmtrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return fmtrainees;
    }
};
