var _ = require('lodash/collection');

exports.bindings = {
    signs: true,
    sign: false,
    state: true,
    download: false,
};

exports.components = [{
    id: 'pager',
    name: 'background-pager',
    options: { model: 'signs' }
}];

exports.events = {
    'click addSign': 'addSign',
    'click check-all': 'checkAll',
    'click check-item*': 'checkItem',
    'click detail*': 'detail',
    'click leave*': 'leave',
    'click checkout1': 'checkout1',
    'click checkout2': 'checkout2',
    'click checkout3': 'checkout3',
};

exports.handlers = {
    checkout1: function() {
        var state = this.bindings.state,
            classId = state.data.classId;
        state.data.type = 1;
        this.module.dispatch('editType', 1);
        this.module.dispatch('signs', { type: 1, classId: classId });
    },
    checkout2: function() {
        var state = this.bindings.state,
            classId = state.data.classId,
            me = this;
        state.data.type = 2;
        this.module.dispatch('editType', 2);
        this.module.dispatch('signs', { type: 2, classId: classId }).then(function(data) {
            if (!data[0] || data[0].items.length === 0) {
                me.module.dispatch('autoFull').then(function(result) {
                    if (result[0] > 0) {
                        me.module.dispatch('signs', { type: 2, classId: state.data.classId });
                    }
                });
            }
        });
    },
    checkout3: function() {
        var state = this.bindings.state,
            classId = state.data.classId;
        state.data.type = 3;
        this.module.dispatch('editType', 3);
        this.module.dispatch('signs', { type: 3, classId: classId });
    },
    addSign: function() {
        var model = this.module.items.edit;
        this.bindings.sign.clear();
        this.app.viewport.modal(model, { type: 'add' });
    },
    checkAll: function(events, obj) {
        this.$$('input[name="signId"]').forEach(function(x) {
            var element = x || {};
            element.checked = obj.checked;
        });
    },
    checkItem: function() {
        var flag = this.$$('input[name="signId"]').length === this.$$('input[name="signId"]:checked').length;
        this.$('check-all').checked = flag;
    },
    detail: function(data) {
        var me = this,
            model = me.module.items['train/service/sign/sign-detail'];
        me.app.viewport.modal(model, { id: data });
    },
    leave: function(data) {
        var me = this,
            model = me.module.items['train/service/sign/sign-leave'];
        me.app.viewport.modal(model, { id: data });
    }
};

exports.actions = {
    'click editSign*': 'editSign',
    'click batchDelete': 'batchDelete',
    'click preview*': 'preview'
};

exports.dataForActions = {
    editSign: function(data) {
        var model = this.module.items.edit;
        this.app.viewport.modal(model, { type: 'edit' });
        return data;
    },
    batchDelete: function() {
        var data = {};
        var ids = [];
        var checked = this.$$('[name="signId"]:checked');
        if (checked.length === 0) {
            return this.app.message.alert('请勾选至少一条数据');
        }
        checked.forEach(function(x) {
            var element = x || {};
            var id = element.value;
            ids.push(id);
        });
        data.ids = ids.join(',');
        return data;
    },
    preview: function(data) {
        var model = this.module.items.preview;
        this.app.viewport.modal(model, true);
        return data;
    },
};

exports.dataForTemplate = {
    signs: function(data) {
        var me = this;
        var signs = data.signs || {};
        var pageNum = me.bindings.signs.getPageInfo().page;
        _.map(signs || [], function(sign1, i) {
            var e = sign1;
            e.downUrl = me.bindings.download.getFullUrl() + '?id=' + e.id;
            e.i = i + 1 + ((pageNum - 1) * 10);
            return e;
        });
        return signs;
    }
};
