exports.type = 'dynamic';

exports.bindings = {
    followcount: true,
    details: true,
    concern: true
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
    'click follow-question-*': 'follow',
    'click unfollow-question-*': 'unfollow',
    'click fabulous-*': 'fabulous',
    'click unfabulous-*': 'unfabulous',
    'click shut-*': 'shut',
    'click fire-*': 'fire',
    'click setEssenceStatus-*': 'setEssenceStatus',
    'click unEssenceStatus-*': 'unEssenceStatus'
};

exports.dataForActions = {
    follow: function(payload) {
        var data = payload;
        data.concernType = 3;
        return data;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = 3;
        return payload;
    },
    fabulous: function(payload) {
        var data = payload;
        data.objectType = 3;
        return payload;
    },
    unfabulous: function(payload) {
        var data = payload;
        data.objectType = 3;
        return payload;
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
    //     // this.module.dispatch('refresh');
    // },
    unfollow: function() {
        this.app.message.success('取消关注成功！');
        // this.module.dispatch('refresh');
    }
};
