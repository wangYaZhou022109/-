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
        sub: { url: '../course-study/gensee-student/sub-status' },
        access: { url: '../course-study/gensee-student/access' },
        accessList: { url: '../course-study/gensee-student/access-list' }
    },
    callbacks: {
        init: function(params) {
            var gensee = this.models.gensee,
                sub = this.models.sub,
                access = this.models.access,
                accessList = this.models.accessList,
                course = this.models.courses;
            gensee.set(params);
            course.set(params);
            sub.set(params);
            accessList.set(params);
            access.set({ genseeId: params.id });
            this.get(gensee);
            // 直播回顾
            this.get(course);
            // 预约状态
            this.get(sub);
            // 参加用户
            this.get(accessList);
            // 保存参加用户
            this.save(access);
        },
        subGensee: function(data) {
            var subGensee = this.models.subGensee,
                me = this;
            subGensee.set(data);
            this.save(subGensee).then(function() {
                me.get(me.models.sub);
                me.app.message.success('操作成功');
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.genseeId });
};
