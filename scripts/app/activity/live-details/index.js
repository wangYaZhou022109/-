var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    STATUS_UNSTART = 1, // 直播状态-未开始
    STATUS_FINISH = 3; // 直播状态-已完成

exports.items = {
    live: 'live',
    main: 'main',
    'relative-courses': 'relative-courses',
    'relative-gensees': 'relative-gensees',
    side: 'side'
};

exports.store = {
    models: {
        gensee: { url: '../course-study/gensee-student/detail' },
        courses: { url: '../course-study/gensee-student/course' },
        down: { url: '../human/file/download' },
        subGensee: { url: '../course-study/gensee-student/sub' },
        relativeGensees: { url: '../course-study/gensee-student/relative-gensees' },
        cancelsubGensee: { url: '../course-study/gensee-student/cancelSub' },
        sub: { url: '../course-study/gensee-student/sub-status' },
        access: { url: '../course-study/gensee-student/access' },
        accessList: { url: '../course-study/gensee-student/access-list' },
        collect: { url: '../system/collect' },
        score: { url: '../course-study/course-front/score' },
        topics: { url: '../system/topic/ids' },
        businessProgress: { url: '../course-study/gensee-student/business' }
    },
    callbacks: {
        init: function(params) {
            var gensee = this.models.gensee,
                sub = this.models.sub,
                access = this.models.access,
                accessList = this.models.accessList,
                collect = this.models.collect,
                course = this.models.courses,
                topics = this.models.topics,
                relativeGensees = this.models.relativeGensees,
                businessProgress = this.models.businessProgress,
                me = this;
            collect.params = { businessId: params.id }; // 收藏
            gensee.set(params);
            accessList.set(params); // 参加用户
            access.set({ genseeId: params.id });
            relativeGensees.params = { genseeId: params.id };

            // 浏览人数+1，同时如果是已开始的直播，保存参与用户并更新参与人数
            return me.save(access, { loading: true }).then(function() {
                return me.chain(me.get(gensee, {
                    slient: true, // get完不触发changed事件
                    loading: true
                }), function() {
                    // 预约状态 - 未开始的直播才需要查询
                    if (gensee.data.status === STATUS_UNSTART) {
                        sub.set(params);
                        me.get(sub);
                    }
                    // 直播回顾 - 已结束的直播才需要查询
                    if (gensee.data.status === STATUS_FINISH) {
                        course.set(params);
                        me.get(course);
                    }

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
                }, [me.get(relativeGensees), me.get(collect), me.get(accessList)]);
            });
        },
        cancelsubGensee: function(data) {
            var cancelsubGensee = this.models.cancelsubGensee,
                me = this;
            cancelsubGensee.set(data);
            this.save(cancelsubGensee).then(function() {
                me.get(me.models.sub);
                me.app.message.success('操作成功');
            });
        },
        subGensee: function(data) {
            var subGensee = this.models.subGensee,
                me = this;
            subGensee.set(data);
            this.save(subGensee).then(function() {
                me.get(me.models.sub);
                me.app.message.success('操作成功');
            });
        },
        collect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.save(collect);
        },
        cancelCollect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.del(collect, { slient: true }).then(function() {
                collect.set({}, true);
            });
        },
        score: function(payload) {
            // 评分
            var score = this.models.score,
                gensee = this.models.gensee;
            score.data.businessId = payload.businessId;
            score.data.businessType = payload.businessType;
            score.data.score = payload.score;
            return this.save(score).then(function(data) {
                gensee.data.avgScore = data[0].avgScore || gensee.data.avgScore;
                gensee.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.genseeId });
};
