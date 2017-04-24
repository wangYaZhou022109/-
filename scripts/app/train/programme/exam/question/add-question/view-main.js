var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    $ = require('jquery');

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

exports.components = [{
    id: 'type',
    name: 'selectize'
}, {
    id: 'level',
    name: 'selectize'
}, {
    id: 'mark',
    name: 'selectize'
}];

exports.dataForTemplate = {
    types: function() {
        var types = maps.get('question-types'),
            data = this.bindings.state.data;
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
    }
};
