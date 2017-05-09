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
            list.studyTotalTime = Number(list.studyTotalTime) / 60; // 转换为分钟
            if (i <= 2) {
                if (list.member.headPortrait) {
                    list.cover = me.bindings.download.getFullUrl() + '?id=' + list.member.headPortrait;
                } else {
                    list.cover = 'images/default-userpic.png';
                }
            }
            return list;
        });
        return lists;
    }
};

exports.events = {
    'click more': 'more'
};

exports.handlers = {
    more: function() {
        var me = this;
        me.module.dispatch('more').then(function(data) {
            me.app.viewport.modal(me.module.items.more, data[0]);
        });
    }
};
