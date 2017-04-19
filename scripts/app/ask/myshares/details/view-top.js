
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
    'click praise-*': 'praise'
};

exports.dataForActions = {
    follow: function(payload) {
        var data = payload;
        data.concernType = 2;
        return data;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = 2;
        return payload;
    },
    praise: function(payload) {
        var data = payload;
        data.objectType = 3;
        return payload;
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

// exports.dataForTemplate = {
//     concern: function(data) {
//         console.log(data.concern);
//     }
// };
