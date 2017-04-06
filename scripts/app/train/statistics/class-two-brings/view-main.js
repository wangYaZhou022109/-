var _ = require('lodash/collection');

exports.bindings = {
    classTwoBrings: true,
    state: true,
    download: false
};

exports.actions = {
    'click edit*': 'edit',
};

exports.dataForActions = {
    edit: function(data) {
        return data;
    }
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'classTwoBrings' }
}];

exports.dataForTemplate = {
    classTwoBrings: function(data) {
        var classTwoBrings = data.classTwoBrings,
            pageNum = this.bindings.classTwoBrings.getPageInfo().page;
        _.map(classTwoBrings || [], function(classTwoBring, i) {
            var e = classTwoBring;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return classTwoBrings;
    },
    exportUrl: function() {
        var url = this.bindings.download.getFullUrl() + '?';
        var params = this.bindings.classTwoBrings.params;
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

exports.actionCallbacks = {
    edit: function() {
        this.app.viewport.modal(this.module.items.edit);
    }
};
