var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    lists: true
};

exports.dataForTemplate = {
    lists: function(data) {
        var lists = data.lists;
        _.map(lists, function(opt, i) {
            var list = opt;
            list.i = i + 1;
            list.studyTotalTime = (Number(list.studyTotalTime) / 60).toFixed(1); // 转换为分钟
            return list;
        });
        return lists;
    }
};
