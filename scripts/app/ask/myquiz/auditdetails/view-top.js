
exports.type = 'dynamic';

exports.bindings = {
    followcount: true,
    details: true
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
    'click unfollow-*': 'unfollow',
    'click del-question-*': 'shut'
};

exports.dataForActions = {
    follow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    unfollow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    shut: function(payload) {
        var data = payload;
        return data;
    }
};

exports.actionCallbacks = {
    // follow: function() {
    //     this.app.message.success('关注成功！');
    // }
    shut: function() {
        this.app.show('content');
    }
};
