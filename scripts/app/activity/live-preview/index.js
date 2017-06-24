var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    live: 'live',
    main: 'main',
    'relative-gensees': 'relative-gensees',
    side: 'side'
};

exports.store = {
    models: {
        gensee: { url: '../course-study/gensee-student/detail' },
        down: { url: '../human/file/download' },
        relativeGensees: { url: '../course-study/gensee-student/relative-gensees' },
        cancelsubGensee: { url: '../course-study/gensee-student/cancelSub' },
        accessList: { url: '../course-study/gensee-student/access-list' },
        topics: { url: '../system/topic/ids' },
        businessProgress: { url: '../course-study/gensee-student/business' }
    },
    callbacks: {
        init: function(params) {
            var gensee = this.models.gensee,
                accessList = this.models.accessList,
                topics = this.models.topics,
                relativeGensees = this.models.relativeGensees,
                businessProgress = this.models.businessProgress,
                me = this;
            gensee.set(params);
            accessList.set(params); // 参加用户
            relativeGensees.params = { genseeId: params.id };

            // 浏览人数+1，同时如果是已开始的直播，保存参与用户并更新参与人数
            return me.chain(me.get(gensee, {
                slient: true, // get完不触发changed事件
                loading: true
            }), function() {
                // 直播资源记录（含当前登录人的参与记录）
                businessProgress.set(params);
                me.get(businessProgress);
            }, function() {
                D.assign(topics.params, {
                    ids: _.map(gensee.data.businessTopics, 'topicId').join(',')
                });
                if (!topics.params.ids) return false;
                return me.get(this.models.topics);
            }, function() {
                D.assign(me.models.gensee.data, {
                    topics: me.models.topics.data
                });
                me.models.gensee.changed();
            }, [me.get(relativeGensees), me.get(accessList)]);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.genseeId });
};
