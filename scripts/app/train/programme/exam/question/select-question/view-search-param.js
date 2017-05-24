var maps = require('./app/util/maps'),
    $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    // getFirstNode,
    D = require('drizzlejs');
    // _ = require('lodash/collection');

exports.bindings = {
    questions: false,
    orgs: true,
    organization: true
};

// exports.type = 'form';

exports.actions = {
    'click searchQuestion': 'searchQuestion'
};

exports.dataForActions = {
    searchQuestion: function(payload) {
        var check = function(data) {
            if (data.type === '999') {
                D.assign(data, { type: null });
            }
            if (data.difficulty === '999') {
                D.assign(data, { difficulty: null });
            }
            return data;
        };
        return this.validate() ? check(payload) : false;
    }
};

// exports.events = {
//     'click showOrganization': 'show'
// };

// exports.handlers = {
//     show: function() {
//         var me = this,
//             model = me.module.items['train/statistics/navigate-tree'],
//             org = me.bindings.organization.data;
//         me.app.viewport.modal(model, {
//             callback: function(payload) {
//                 org.id = payload.id;
//                 org.name = payload.name;
//                 me.bindings.org.changed();
//             }
//         });
//     }
// };

exports.components = [function() {
    var me = this,
        obj = {
            id: 'owner',
            name: 'picker',
            options: {
                // module: this.module.renderOptions.url || 'exam/question-depot',
                module: 'exam/question-depot',
                picker: 'owner',
                required: false,
                autoFill: false,
                selectChanged: function(payload) {
                    return me.components['question-depot'].reset({
                        operatorType: me.app.global.EDIT,
                        state: 1,
                        organizationId: payload.id,
                        share: true
                    });
                }
            }
        };
    return obj;
}, function() {
    var obj = {
        id: 'question-depot',
        name: 'picker',
        options: {
            picker: 'question-depot',
            required: false,
            inputName: 'questionDepotId',
            params: {
                operatorType: this.app.global.EDIT,
                state: 1,
                share: false
                // organizationId: 1
            },
            data: {}
        }
    };
    // if (orgs.data.length > 0) {
    //     obj.options.params.organizationId = getFirstNode(orgs.data).id;
    // }
    return obj;
}];

exports.dataForTemplate = {
    types: function() {
        var result = maps.get('question-types');
        result.unshift({ key: '999', value: '全部' });
        return result;
    },
    difficultys: function() {
        var result = maps.get('question-difficultys');
        result.unshift({ key: '999', value: '全部' });
        return result;
    }
};

exports.mixin = {
    validate: function() {
        var organizationId = $(this.$('organizationId')),
            depot = $(this.$('questionDepotId')),
            flag = true;

        markers.text.valid(organizationId);
        markers.text.valid(depot);

        if (organizationId.val() === '') {
            markers.text.invalid(organizationId, validators.required.message);
            flag = false;
        }

        if (depot.val() === '') {
            markers.text.invalid(depot, validators.required.message);
            flag = false;
        }
        return flag;
    }
};

// getFirstNode = function(nodes) {
//     var d = { map: {}, list: [] };
//     _.map(nodes, function(item) {
//         d.map[item.id] = item;
//     });
//     _.map(nodes, function(item) {
//         if (!item.parentId || !d.map[item.parentId]) {
//             d.list.push(d.map[item.id]);
//         }
//     });
//     if (d.list.length) {
//         return { id: d.list[0].id, text: d.list[0].name };
//     }
//     return {};
// };
