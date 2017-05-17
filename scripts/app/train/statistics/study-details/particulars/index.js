var D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.title = '学习详情';

exports.store = {
    models: {
        particularss: {
            url: '../course-study/course-study-progress/progress-by-member'
        },
        onLine: {
            url: '../train/study-details/course'
        },
        member: {
            url: '../train/study-details/member'
        }
    },
    callbacks: {
        init: function(payload) {
            var particularss = this.models.particularss,
                member = this.models.member,
                onLine = this.models.onLine,
                me = this;
            onLine.params.classId = payload.payload.classId;
            this.get(onLine);
            member.params.classId = payload.payload.classId;
            this.get(member).then(function(data) {
                D.assign(particularss.params, { memberId: payload.payload.memberId, courseIds: data[0].courseIds });
                me.get(particularss);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { payload: this.renderOptions.payload });
};
