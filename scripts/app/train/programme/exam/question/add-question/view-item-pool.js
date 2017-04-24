var $ = require('jquery'),
    D = require('drizzlejs');

// exports.type = 'form';

exports.bindings = {
    state: false,
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
        obj = {
            id: 'owner',
            name: 'picker',
            options: {
                module: 'train/programme/question-depot',
                picker: 'owner',
                required: true,
                params: { operatorType: operatorType },
                data: {}
            }
        },
        question = this.bindings.state.data,
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
    var obj = {
            id: 'questionDepot',
            name: 'picker',
            options: {
                picker: 'question-depot',
                required: true,
                inputName: 'questionDepotId',
                params: {
                    operatorType: this.app.global.EDIT
                },
                data: {}
            }
        },
        question = this.bindings.state.data,
        itemPool = this.bindings.itemPool.data;

    if (question.questionDepot) {
        obj.options.data.id = question.questionDepot.id;
        obj.options.data.name = question.questionDepot.name;
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
    }
};
