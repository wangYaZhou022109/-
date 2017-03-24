var $ = require('jquery');

exports.bindings = {
    classEvaluate: true,
    state: true
};

exports.dataForTemplate = {
    classEvaluate: function(data) {
        var classEvaluate = data.classEvaluate;
        return classEvaluate;
    }
};

exports.events = {
    'click edit-classEvaluates*': 'editClassEvaluates',
    'click statistics*': 'statistics',
    'click label-startTime-*': 'changeStartTime',
    'change input-startTime-': 'updateStartTime',
    'click label-endTime-*': 'changeEndTime',
    'change input-endTime-': 'updateEndTime',
};

exports.handlers = {
    editClassEvaluates: function(data) {
        var me = this,
            classId = this.bindings.state.data.classId,
            view4 = me.module.items['train/statistics/questionnaire/research'],
            options = {};
        options.id = data;
        options.classId = classId;
        this.app.viewport.modal(view4, { payload: options });
    },
    changeStartTime: function(id) {
        $(this.$('input-startTime-')).css('display', 'block');
        $(this.$('label-startTime-' + id)).css('display', 'none');
    },
    updateStartTime: function() {
        var classEvaluate = this.bindings.classEvaluate.data[0].id;
        var start = $(this.$('input-startTime-')).val();
        var end = $(this.$('input-endTime-')).val();
        if (start === '') {
            this.app.message.alert('开始时间不能为空');
        } else if (start > end) {
            this.app.message.alert('结束时间不能小于开始时间');
        } else {
            this.module.dispatch('updateStartTime', { id: classEvaluate, startTime: start });
        }
    },
    changeEndTime: function(id) {
        $(this.$('input-endTime-')).css('display', 'block');
        $(this.$('label-endTime-' + id)).css('display', 'none');
    },
    updateEndTime: function() {
        var classEvaluate = this.bindings.classEvaluate.data[0].id;
        var start = $(this.$('input-startTime-')).val();
        var end = $(this.$('input-endTime-')).val();
        if (end === '') {
            this.app.message.alert('结束时间不能为空');
        } else if (start > end) {
            this.app.message.alert('结束时间不能小于开始时间');
        } else {
            this.module.dispatch('updateEndTime', { id: classEvaluate, endTime: end });
        }
    }
};

exports.components = [function() {
    var data = this.bindings.classEvaluate.data;
    return {
        id: 'input-startTime-',
        name: 'flatpickr',
        options: {
            enableTime: true,
            defaultDate: data.startTime || ''
        }
    };
}, function() {
    var data = this.bindings.classEvaluate.data;
    return {
        id: 'input-endTime-',
        name: 'flatpickr',
        options: {
            enableTime: true,
            defaultDate: data.endTime || ''
        }
    };
}];
