
exports.type = 'dynamic';

exports.bindings = {
    followcount: true,
    topicname: true
};

exports.getEntityModuleName = function(key) {
    return 'ask/' + key;
};
exports.getEntity = function() {
    return {
        state: this.bindings.followcount.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};


exports.actions = {
    'click follow-expert': 'follow',
    'click unfollow-expert': 'unfollow'
};

exports.dataForActions = {
    follow: function(payload) {
        var data = payload;
        data.concernType = '1';
        return data;
    },
    unfollow: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    // follow: function() {
    //     this.app.message.success('关注成功！');
    // }
};
