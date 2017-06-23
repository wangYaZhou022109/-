var $ = require('jquery'),
    // markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
    // _ = require('lodash/collection');

exports.ADD_QUESTIONARY = 'train/programme/research-activity/add-research-activity/steps/step-2';

exports.bindings = {
    research: true,
    img: false,
    time: false
};

exports.type = 'dynamic';

exports.events = {
    'change name': 'changeInfo',
    'change start-time': 'changeTime',
    'change end-time': 'changeTime',
    'change questionaryDetail': 'changeInfo'
};

exports.handlers = {
    changeInfo: function() {
        return this.module.dispatch('changeInfo', this.getData());
    },
    changeTime: function() {
        var start = $(this.$('start-time')).val(),
            end = $(this.$('end-time')).val();
        if (end !== '' && end !== null) {
            if (start !== '' && start !== null) {
                if (start >= end) {
                    this.app.message.alert('开始时间不能大于或者等于结束时间');
                    $(this.$('end-time')).val('');
                }
            } else {
                this.app.message.alert('请先填写开始时间');
                $(this.$('end-time')).val('');
            }
        }
        return this.module.dispatch('changeInfo', this.getData());
    }
};

exports.dataForTemplate = {
    research: function(data) {
        var research = data.research;
        if (research) {
            research.startTime = this.module.renderOptions.startTime;
            research.endTime = this.module.renderOptions.endTime;
            // this.bindings.research.changed();
        }
        return research;
    }
};

exports.components = [{
    id: 'start-time',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'end-time',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}];

exports.getEntity = function() {
    return this.bindings.research.data;
};

exports.getEntityModuleName = function() {
    return this.options.ADD_QUESTIONARY;
};

exports.dataForEntityModule = function(entity) {
    return { research: entity };
};

exports.mixin = {
    getData: function() {
        return {
            name: this.$('name').value,
            startTime: this.$('start-time').value,
            endTime: this.$('end-time').value,
            questionaryDetail: $(this.$('questionaryDetail')).val().trim()
        };
    },
    validate: function() {
        var name = this.$('name'),
            start = this.$('start-time'),
            end = this.$('end-time'),
            // startTime = $(this.$('start')),
            questionaryDetail = this.$('questionaryDetail'),
            flag = true;

        // markers.text.valid(name);
        // markers.text.valid(start);
        // markers.text.valid(end);
        // markers.text.valid(questionaryDetail);

        if (!validators.required.fn(name.value)) {
            $(name).addClass('error');
            if (this.module.options.RESEARCH_TYPE === 2) {
                this.app.message.error('调研名称必填');
            } else if (this.module.options.RESEARCH_TYPE === 3) {
                this.app.message.error('评估名称必填');
            }
            flag = false;
        }
        if (!validators.maxLength.fn(name.value, 30)) {
            $(name).addClass('error');
            if (this.module.options.RESEARCH_TYPE === 2) {
                this.app.message.error('调研名称最大长度为:30');
            } else if (this.module.options.RESEARCH_TYPE === 3) {
                this.app.message.error('评估名称必填最大长度为:30');
            }
            flag = false;
        }
        $(name).removeClass('error');
        if (!validators.required.fn(questionaryDetail.value)) {
            $(questionaryDetail).addClass('error');
            this.app.message.error('问卷须知必填');
            flag = false;
        }
        if (!validators.maxLength.fn(questionaryDetail.value, 1000)) {
            $(questionaryDetail).addClass('error');
            this.app.message.error('问卷须知最大长度为:1000');
            flag = false;
        }
        $(questionaryDetail).removeClass('error');

        if (!validators.required.fn(start.value)) {
            $(start).addClass('error');
            this.app.message.error('开始时间必填');
            flag = false;
        }
        $(start).removeClass('error');
        if (!validators.required.fn(end.value)) {
            $(end).addClass('error');
            this.app.message.error('结束时间必填');
            flag = false;
        }
        $(end).removeClass('error');
        return flag;
    }
};

