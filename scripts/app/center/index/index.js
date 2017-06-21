var D = require('drizzlejs');

exports.items = {
    top: 'top',
    notice: 'notice',
    menu: 'menu',
    'center/edit': { isModule: true },
    interest: 'interest',
    'center/index/more': { isModule: true }
};

exports.store = {
    models: {
        menus: { data: [ // id必须从0开始，一定要按索引顺序
            { id: '0', name: '我的任务', icon: 'icon-task', url: 'task', current: true },
            { id: '1', name: '我的学习', icon: 'icon-type', url: 'study', childs: [ // eslint-disable-line object-property-newline,max-len
                { id: '1-0', name: '我的课程', url: 'study/course' },
                { id: '1-1', name: '我的专题', url: 'study/subject' },
                { id: '1-2', name: '我的知识', url: 'study/knowledge' },
                { id: '1-3', name: '岗位学习', url: 'study/position' }
            ] },
            { id: '2', name: '我的活动', icon: 'icon-tag-1', url: 'activity', childs: [ // eslint-disable-line object-property-newline,max-len
               // { id: '2-0', name: '我的mooc', url: 'mooc' },
                { id: '2-0', name: '我的直播', url: 'live' },
                { id: '2-1', name: '我的考试', url: 'exam' },
                { id: '2-2', name: '我的班级', url: 'class' },
                { id: '2-3', name: '我的调研', url: 'research' }
            ] },
            { id: '3', name: '我的问吧', icon: 'icon-wen', url: 'ask', childs: [ // eslint-disable-line object-property-newline,max-len
                { id: '3-0', name: '我的问答', url: 'answer' },
                { id: '3-1', name: '我的关注', url: 'follow' }
            ] },
            { id: '4', name: '我的收藏', icon: 'icon-favorite', url: 'collection' },
            { id: '5', name: '我的档案', icon: 'icon-file', url: 'archives' }
        ] },
        state: {
            data: {
                menu: 'task', // 初始菜单
            }
        },
        recommendList: {
            url: '../course-study/course-info/person-index'
        }, // 首页推荐
        page: { data: { value: '1' } }, // 记录页码
        down: { url: '../human/file/download' },
        member: { url: '../human/member/center', autoLoad: 'after' },
        img: { url: '../human/file/download?id=' },
        integral: { url: '../system/integral-result/grade', autoLoad: 'after' }, // 积分和等级
        courseTime: { url: '../course-study/course-study-progress/total-time', autoLoad: 'after' }, // 总学习时长
        lecturer: { url: '../course-study/gensee/find-lecturer', autoLoad: 'after' }, // 是否为讲师
        expert: { url: '../ask-bar/expert/find-expert', autoLoad: 'after' }, // 是否专家
        expertMe: { url: '../ask-bar/expert/me', autoLoad: 'after' }, // 当前用户的专家信息
        contact: { url: '../train/project/find-contact', autoLoad: 'after' }, // 是否需求方
        classstff: { url: '../train/classstaff/find-classstaff', autoLoad: 'after' }, // 是否班务
        announcements: { url: '../system/operation/announcement/person-list' }, // 公告
        insertReadState: { url: '../system/operation/announcement/insertReadStatus' }
    },
    callbacks: {
        init: function(options) {
            var me = this,
                recommendList = me.models.recommendList,
                announcements = me.models.announcements,
                state = me.models.state.data;
            if (options && options.name) {
                if (options.name === 'course') {
                    state.menu = 'study/course';
                } else if (options.name === 'subject') {
                    state.menu = 'study/subject';
                } else if (options.name === 'knowledge') {
                    state.menu = 'study/knowledge';
                } else if (options.name === 'position') {
                    state.menu = 'study/position';
                } else {
                    state.menu = options.name;
                }
            }
            recommendList.clear();
            recommendList.params = { page: 1, pageSize: 5 };
            me.get(recommendList);
            announcements.clear();
            announcements.params = { page: 1, pageSize: 1 };
            me.get(announcements);
        },
        changeRecommend: function() {
            var me = this,
                recommendList = me.models.recommendList,
                page = this.models.page.data.value;
            recommendList.params = { page: page, pageSize: 5 };
            me.get(recommendList);
        },
        prevNotice: function(payload) {
            var me = this,
                announcements = me.models.announcements;
            D.assign(announcements.params, payload);
            me.get(announcements);
        },
        nextNotice: function(payload) {
            var me = this,
                announcements = me.models.announcements;
            D.assign(announcements.params, payload);
            me.get(announcements);
        },
        insertReadState: function() {
            var me = this;
            this.put(this.models.insertReadState).then(function() {
                me.get(me.models.announcements);
            });
        },
        refreshMember: function() {
            var me = this,
                member = me.models.member;
            return me.get(member);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
