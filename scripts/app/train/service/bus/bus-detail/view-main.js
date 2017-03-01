var _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    busDetail: true,
    export: false,
};

exports.components = [{
    id: 'pager',
    name: 'background-pager',
    options: { model: 'busDetail' }
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
    busDetail: function(data) {
        var busDetail = data.busDetail,
            pageNum = this.bindings.busDetail.getPageInfo().page;
        _.map(busDetail || [], function(busDetai, i) {
            var e = busDetai;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return busDetail;
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
