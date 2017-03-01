var _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    signDetail: true,
    export: false,
};

exports.components = [{
    id: 'pager',
    name: 'background-pager',
    options: { model: 'signDetail' }
}];

exports.events = {
};

exports.handlers = {
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
    }
};

// exports.dataForTemplate = {
//     exportUrl: function() {
//         var url = this.bindings.export.getFullUrl() + '?';
//         var params = this.bindings.search.getQueryParams();
//         var token = this.app.global.OAuth.token.access_token;

//         params.pageSize = 100000;
//         params.page = 1;
//         _.map(params, function(v, k) {
//             url += (k + '=' + v + '&');
//         });
//         url += ('access_token=' + token);
//         return url;
//     }
// };
