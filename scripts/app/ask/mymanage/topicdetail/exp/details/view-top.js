
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
    'click follow-expert': 'follow',
    'click unfollow-expert': 'unfollow',
    'click shut-*': 'shut',
    'click fire-*': 'fire',
    'click setEssenceStatus-*': 'setEssenceStatus',
    'click unEssenceStatus-*': 'unEssenceStatus',
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
        data.closeStatus = 1;
        return data;
    },
    fire: function(payload) {
        var data = payload;
        data.closeStatus = 0;
        return data;
    },
    setEssenceStatus: function(payload) {
        var data = payload;
        data.essenceStatus = 1;
        return data;
    },
    unEssenceStatus: function(payload) {
        var data = payload;
        data.essenceStatus = 0;
        return data;
    }
};

exports.actionCallbacks = {
    // follow: function() {
    //     this.app.message.success('关注成功！');
    // }
};
