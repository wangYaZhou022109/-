var _ = require('lodash/collection'),
    remoteBackGround = 'http://img.zcool.cn/community/0192475847b9d3a8012060c82f4741.gif';

exports.bindings = {
    relatedTopics: true,
    down: true,
    relatedMembers: true
};

exports.dataForTemplate = {
    relatedMembers: function() {
        var me = this,
            relatedMembers = this.bindings.relatedMembers.data;
        if (relatedMembers) {
            _.map(relatedMembers, function(e) {
                var t = e;
                if (e.headPortrait) {
                    t.img = me.bindings.down.getFullUrl() + '?id=' + e.headPortrait;
                } else {
                    t.img = remoteBackGround;
                }
                return t;
            });
        }
        return relatedMembers;
    }
};
