var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    STATUS_UNSTART = 1, // 直播状态-未开始
    STATUS_LIVING = 2, // 直播状态-进行中
    STATUS_FINISH = 3; // 直播状态-已完成

exports.items = {
    live: 'live',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        gensee: { url: '../course-study/gensee-student/detail' },
        courses: { url: '../course-study/gensee-student/course' },
        down: { url: '../human/file/download' },
        subGensee: { url: '../course-study/gensee-student/sub' },
        cancelsubGensee: { url: '../course-study/gensee-student/cancelSub' },
        sub: { url: '../course-study/gensee-student/sub-status' },
        access: { url: '../course-study/gensee-student/access' },
        accessList: { url: '../course-study/gensee-student/access-list' },
        collect: { url: '../system/collect' },
        score: { url: '../course-study/course-front/score' },
        topics: { url: '../system/topic/ids' }
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
                me = this;
            collect.params = { businessId: params.id }; // 收藏
            gensee.set(params);
            accessList.set(params); // 参加用户
            access.set({ genseeId: params.id });

            return this.chain(this.get(gensee, {
                slient: true // get完不触发changed事件
            }), function() {
                // 预约状态 - 未开始的直播才需要查询
                if (gensee.data.status === STATUS_UNSTART) {
                    sub.set(params);
                    me.get(sub);
                }
                // 保存参加用户
                if (gensee.data.status === STATUS_LIVING) {
                    me.save(access);
                }
                // 直播回顾 - 已结束的直播才需要查询
                if (gensee.data.status === STATUS_FINISH) {
                    course.set(params);
                    me.get(course);
                }
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
            }, [me.get(collect), me.get(accessList)]);
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
        score: function() {
            // 评分
            var score = this.models.score,
                gensee = this.models.gensee;
            score.data.businessId = gensee.data.id;
            score.data.businessType = 5;
            return this.save(score).then(function(data) {
                gensee.data.courseScore = data[0];
                gensee.changed();
            });
        },
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.genseeId });
};
