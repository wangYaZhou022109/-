var $ = require('jquery'),
    ADD_QUESTIONARY = 'train/programme/research-activity/add-research-activity/steps/step-2';

exports.bindings = {
    research: true
};

exports.type = 'dynamic';

exports.events = {
    'change name': 'changeInfo',
    'change start-time': 'changeInfo',
    'change end-time': 'changeInfo',
    'change questionaryDetail': 'changeInfo'
};

exports.handlers = {
    changeInfo: function() {
        return this.module.dispatch('changeInfo', this.getData());
    }
};

exports.components = [{
    id: 'start-time',
    name: 'flatpickr'
}, {
    id: 'end-time',
    name: 'flatpickr'
}];

exports.getEntity = function() {
    return this.bindings.research.data;
};

exports.getEntityModuleName = function() {
    return ADD_QUESTIONARY;
};

exports.dataForEntityModule = function(entity) {
    return { research: entity };
};

exports.mixin = {
    getData: function() {
        return {
            name: this.$('name').value,
            startTime: $(this.$('start-time')).val(),
            endTime: $(this.$('end-time')).val(),
            questionaryDetail: $(this.$('questionaryDetail')).val().trim()
        };
    }
};

