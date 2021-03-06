exports.bindings = {
    member: true,
    img: false,
    integral: true,
    courseTime: true,
    lecturer: true,
    expert: true,
    expertMe: true,
    contact: true,
    classstff: true
};

exports.events = {
    'click edit-info': 'showEditInfo'
};

exports.handlers = {
    showEditInfo: function() {
        var me = this,
            model = this.module.items['center/edit'];
        this.app.viewport.modal(model, { callback: function() { me.module.dispatch('refreshMember'); } });
    }
};

exports.dataForTemplate = {
    member: function(data) {
        var integral = data.integral,
            member = this.bindings.member.data,
            downUrl = this.bindings.img.getFullUrl(),
            time = '',
            second = 0, // 秒
            minute = 0, // 分
            hour = 0; // 小时
        if (data.lecturer === 1) {
            member.isLecture = true;
        }
        if (data.expert === 1) {
            member.isExpert = true;
            member.expertDetailId = data.expertMe.id + ',' + member.id;
        }
        if (data.contact === 1) {
            member.isContact = true;
        }
        if (data.classstff === 1) {
            member.isClassstff = true;
        }
        member.gradeCover = member.gradeCover == null ? '' : downUrl + member.gradeCover;
        member.integralCount = integral.totalScore == null ? 0 : integral.totalScore;
        second = data.courseTime == null ? 0 : window.parseInt(data.courseTime);
        if (second > 60) {
            minute = window.parseInt(second / 60);
            second = window.parseInt(second % 60);
            if (minute > 60) {
                hour = window.parseInt(minute / 60);
                minute = window.parseInt(minute % 60);
            }
            // 大于等于30秒的时候加1分钟
            if (second >= 30) {
                minute += 1;
            }
        }
        time = second;
        if (minute > 0) {
            time = minute + '分';// + time;
        }
        if (hour > 0) {
            time = hour + '小时' + time;
        }
        member.totalStudyTime = time;
        return member;
    },
    photo: function() {
        var memberDetail = this.bindings.member.data.memberDetail,
            downUrl = this.bindings.img.getFullUrl();
        if (memberDetail && memberDetail.headPortrait) {
            return downUrl + memberDetail.headPortrait;
        }
        return 'images/default-userpic.png';
    }
};
