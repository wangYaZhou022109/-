var _ = require('lodash/collection');
exports.bindings = {
    pageList: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'pageList' }
}];

exports.dataForTemplate = {
    mores: function(data) {
        var mores = data.pageList;
        _.map(mores, function(opt, i) {
            var list = opt;
            list.i = i + 1;
            list.studyTotalTime = (Number(list.studyTotalTime) / 60).toFixed(1); // 转换为分钟
            return list;
        });
        return mores;
    }
};
