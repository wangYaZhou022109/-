var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    lists: true,
    download: false
};

exports.dataForTemplate = {
    lists: function(data) {
        var lists = data.lists,
            me = this;
        _.map(lists, function(opt, i) {
            var list = opt;
            list.i = i + 1;
            list.studyTotalTime = (Number(list.studyTotalTime) / 60).toFixed(1); // 转换为分钟
            list.cover = me.bindings.download.getFullUrl() + '?id=' + list.member.headPortrait;
            return list;
        });
        return lists;
    }
};
