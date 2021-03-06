var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    state: false
};

// exports.type = 'form';

exports.large = true;

exports.events = {
    'change type': 'changeType'
};

exports.handlers = {
    changeType: function(e, target) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '请确定更改试题类型吗？';
            me.app.message.confirm(message, function() {
                me.bindings.state.data.type = target.value;
                return me.module.dispatch('refresh');
            }, function() {
                resolve(false);
            });
        });
    }
};

// exports.components = [{
//     id: 'type',
//     name: 'selectize'
// }, {
//     id: 'level',
//     name: 'selectize'
// }, {
//     id: 'mark',
//     name: 'selectize'
// }];

exports.dataForTemplate = {
    types: function() {
        var types = maps.get('research-question-types'),
            data = this.bindings.state.data;
        if (data.sourceType === 4) { // 评估问卷不需要多选题
            types = maps.get('evaluate-question-types');
        }
        if (data) {
            _.map(types, function(t) {
                var obj = t;
                if (Number(obj.key) === Number(data.type)) {
                    obj.selected = true;
                }
            });
        }
        return types;
    },
    difficultys: function() {
        var difficultys = maps.get('question-difficultys'),
            data = this.bindings.state.data;
        if (data) {
            _.map(difficultys, function(t) {
                var obj = t;
                if (Number(obj.key) === Number(data.difficulty)) {
                    obj.selected = true;
                }
            });
        }
        return difficultys;
    }
};

exports.mixin = {
    getData: function() {
        var data = {};
        data.type = $(this.$$('[name="type"]')).val();
        data.difficulty = $(this.$$('[name="difficulty"]')).val();
        return data;
    },
    validate: function() {
        var type = $(this.$$('[name="type"]')),
            flag = true;
        markers.text.valid(type);

        if (type.val() === '' || type.val() === null) {
            markers.text.invalid(type, validators.required.message);
            flag = false;
        }

        return flag;
    }
};
