
exports.type = 'dynamic';

exports.bindings = {
    followcount: true,
    topicname: true,
    topicdetail: true
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
    'click follow-*': 'follow',
    'click unfollow-*': 'unfollow'
};

exports.dataForActions = {
    follow: function(payload) {
        var data = payload;
        data.concernType = 4;
        return data;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = 4;
        return payload;
    }
};

exports.actionCallbacks = {
};
