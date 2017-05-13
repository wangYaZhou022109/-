var $ = require('jquery'),
    D = require('drizzlejs'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

// exports.type = 'form';

exports.bindings = {
    state: true,
    itemPool: true
};

exports.events = {
    'click check-owner': 'checkOwner'
};

exports.handlers = {
    checkOwner: function() {
        var data = this.bindings.itemPool.data;
        if (this.$('check-owner').checked) {
            data.entryDepot = true;
        } else {
            data.entryDepot = false;
        }
        this.module.dispatch('reloadItemPool');
    }
};

exports.components = [function() {
    var operatorType = this.app.global.EDIT,
        state = this.bindings.state,
        me = this,
        obj = {
            id: 'owner',
            name: 'picker',
            options: {
                module: 'exam/question-depot',
                picker: 'owner',
                required: true,
                autoFill: true,
                params: {
                    operatorType: operatorType,
                },
                data: {},
                selectChanged: function(data) {
                    return me.module.dispatch('selectOwnerChanged', data);
                }
            }
        },
        question = state.data,
        itemPool = this.bindings.itemPool.data;
    if (question.organization) {
        obj.options.data.id = question.organization.id;
        obj.options.data.text = question.organization.name;
    }

    if (itemPool.entryDepot) {
        return obj;
    }
    return null;
}, function() {
    var params = this.bindings.state.params,
        obj = {
            id: 'questionDepot',
            name: 'picker',
            options: {
                picker: 'question-depot',
                required: true,
                inputName: 'questionDepotId',
                params: {
                    operatorType: this.app.global.EDIT,
                    organizationId: params.organization && params.organization.id,
                    state: 1
                },
                data: {}
            }
        },
        question = this.bindings.state.data,
        itemPool = this.bindings.itemPool.data;
    if (question.questionDepot) {
        obj.options.data.id = question.questionDepot.id;
        obj.options.data.name = question.questionDepot.name;
    } else if (params && params.questionDepot) {
        obj.options.data.id = params.questionDepot.id;
        obj.options.data.name = params.questionDepot.name;
    }

    if (itemPool.entryDepot) {
        return obj;
    }
    return null;
}];


exports.mixin = {
    getData: function() {
        var owner = this.components.owner,
            depot = this.components.questionDepot;

        if (owner) {
            return D.assign({}, {
                organizationId: $(this.$$('[name="organizationId"]')).val(),
                questionDepotId: $(this.$$('[name="questionDepotId"]')).val(),
                organization: { id: owner.getData().id, name: owner.getData().text },
                questionDepot: { id: depot.getData().id, name: depot.getData().text }
            });
        }
        return null;
    },
    validate: function() {
        var organizationId = $(this.$$('[name="organizationId"]')),
            depot = $(this.$$('[name="questionDepotId"]')),
            org = $(this.$('organization')),
            dep = $(this.$('questionName')),
            flag = true,
            itemPool = this.bindings.itemPool.data;

        markers.text.valid(organizationId);
        markers.text.valid(depot);
        if (itemPool.entryDepot) {
            if (!organizationId.val()) {
                markers.text.invalid(org, validators.required.message);
                flag = false;
            }
            if (!depot.val()) {
                markers.text.invalid(dep, validators.required.message);
                flag = false;
            }
        }
        return flag;
    }
};
