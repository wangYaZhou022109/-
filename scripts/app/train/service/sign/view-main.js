exports.bindings = {
    signs: true,
    sign: false
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
};

exports.handlers = {
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

exports.actionCallBacks = {
};

