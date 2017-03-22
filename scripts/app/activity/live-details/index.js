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
    },
    callbacks: {
        init: function(params) {
            var gensee = this.models.gensee,
                sub = this.models.sub,
                access = this.models.access,
                accessList = this.models.accessList,
                collect = this.models.collect,
                course = this.models.courses;
            collect.params = { businessId: params.id };
            gensee.set(params);
            course.set(params);
            sub.set(params);
            accessList.set(params);
            access.set({ genseeId: params.id });
            this.get(gensee);
             // 收藏
            this.get(collect);
            // 直播回顾
            this.get(course);
            // 预约状态
            this.get(sub);
            // 参加用户
            this.get(accessList);
            // 保存参加用户
            this.save(access);
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
