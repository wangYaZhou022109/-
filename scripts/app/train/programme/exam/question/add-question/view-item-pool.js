var $ = require('jquery'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    getFirstNode;

// exports.type = 'form';

exports.bindings = {
    state: true,
    itemPool: true,
    orgs: true
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
                // module: this.module.renderOptions.url || 'exam/question-depot',
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
    if (question.organization && !state.params.priority) {
        obj.options.data.id = question.organization.id;
        obj.options.data.text = question.organization.name;
    } else if (state.params.organization) {
        obj.options.data.id = state.params.organization.id;
        obj.options.data.text = state.params.organization.name;
    }

    if (itemPool.entryDepot) {
        return obj;
    }
    return null;
}, function() {
    var params = this.bindings.state.params,
        orgs = this.bindings.orgs,
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
                    state: 1,
                    autoFill: true
                },
                data: {}
            }
        },
        question = this.bindings.state.data,
        itemPool = this.bindings.itemPool.data;

    //  修改时初始化
    if (question.questionDepot) {
        obj.options.data.id = question.questionDepot.id;
        obj.options.data.name = question.questionDepot.name;
    //  从管理列表的左侧目录传入的参数
    } else if (params && params.questionDepot) {
        obj.options.data.id = params.questionDepot.id;
        obj.options.data.name = params.questionDepot.name;
    //  当选择了别的部门，默认取部门对应目录的第一个
    } else if (!obj.options.params.organizationId && orgs.data.length > 0) {
        obj.options.params.organizationId = getFirstNode(orgs.data).id;
    }

    //  是否入库
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

getFirstNode = function(nodes) {
    var d = { map: {}, list: [] };
    _.map(nodes, function(item) {
        d.map[item.id] = item;
    });
    _.map(nodes, function(item) {
        if (!item.parentId || !d.map[item.parentId]) {
            d.list.push(d.map[item.id]);
        }
    });
    if (d.list.length) {
        return { id: d.list[0].id, text: d.list[0].name };
    }
    return {};
};
