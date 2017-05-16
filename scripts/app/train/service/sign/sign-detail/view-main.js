var _ = require('lodash/collection');

exports.bindings = {
    signDetail: true,
    export: false,
    state: {}
};

exports.components = [{
    id: 'pager',
    name: 'pager',
    options: { model: 'signDetail' }
}];

exports.events = {
    'click update*': 'updateState',
    'click check-all': 'checkAll',
    'click check-item*': 'checkItem',
    'click batchStatus': 'batchStatus',
};

exports.handlers = {
    updateState: function(id) {
        this.bindings.state.data.id = id;
        this.app.viewport.modal(this.module.items.status);
    },
    checkAll: function(events, obj) {
        this.$$('input[name="detailId"]').forEach(function(x) {
            var element = x || {};
            element.checked = obj.checked;
        });
    },
    checkItem: function() {
        var flag = this.$$('input[name="detailId"]').length === this.$$('input[name="detailId"]:checked').length;
        this.$('check-all').checked = flag;
    },
    batchStatus: function() {
        var data = {};
        var ids = [];
        var checked = this.$$('[name="detailId"]:checked');
        if (checked.length === 0) {
            return this.app.message.alert('请勾选至少一条数据');
        }
        checked.forEach(function(x) {
            var element = x || {};
            var id = element.value;
            ids.push(id);
        });
        data.ids = ids.join(',');
        this.bindings.state.data.ids = data.ids;
        this.app.viewport.modal(this.module.items['batch-status']);
        return data;
    },
};

exports.actions = {

};

exports.dataForActions = {

};

exports.actionCallBacks = {

};

exports.dataForTemplate = {
    signDetail: function(data) {
        var signDetail = data.signDetail,
            pageNum = this.bindings.signDetail.getPageInfo().page;
        _.map(signDetail || [], function(signdetail, i) {
            var e = signdetail;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return signDetail;
    },
    exportUrl: function() {
        var url = this.bindings.export.getFullUrl() + '?';
        var params = this.bindings.signDetail.params;
        var token = this.app.global.OAuth.token.access_token;
        params.pageSize = 100000;
        params.page = 1;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        url += ('access_token=' + token);
        return url;
    }
};
