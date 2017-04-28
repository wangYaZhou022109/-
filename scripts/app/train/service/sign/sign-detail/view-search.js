var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    signDetail: true,
    export: false,
    state: true,
};

exports.events = {
    'click batchStatus1': 'batchStatus',
};

exports.handlers = {
    batchStatus: function() {
        var data = {};
        var ids = [];
        var model = this.module.items.main;
        var checked = model.$$('[name="detailId"]:checked');
        if (checked.length === 0) {
            return this.app.message.alert('请勾选至少一条数据');
        }
        checked.forEach(function(x) {
            var element = x || {};
            var id = element.value;
            ids.push(id);
        });
        data.ids = ids.join(',');
        model.bindings.state.data.ids = data.ids;
        this.app.viewport.modal(this.module.items['batch-status']);
        return data;
    },
};

exports.actions = {
    'click search': 'search',
    'click batchStatus': 'batchStatus',
};

exports.dataForActions = {
    search: function() {
        return {
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            state: $(this.$$('[name="state"]')).val()
        };
    }
};

exports.dataForTemplate = {
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
