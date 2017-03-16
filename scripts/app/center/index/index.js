exports.items = {
    top: 'top',
    notice: 'notice',
    menu: 'menu',
    'center/edit': { isModule: true },
    interest: 'interest'
};

exports.store = {
    models: {
        menus: { data: [
            { id: '0', name: '我的任务', icon: 'icon-task', url: 'task', current: true },
            { id: '1', name: '我的学习', icon: 'icon-type', url: 'study', childs: [ // eslint-disable-line object-property-newline,max-len
                { id: '1-0', name: '我的课程', url: 'study/course' },
                { id: '1-1', name: '我的专题', url: 'study/subject' },
                { id: '1-2', name: '我的知识', url: 'study/knowledge' },
                { id: '1-3', name: '岗位学习', url: 'study/jobs' }
            ] },
            { id: '2', name: '我的活动', icon: 'icon-tag-1', url: 'activity', childs: [ // eslint-disable-line object-property-newline,max-len
                { id: '2-0', name: '我的mooc', url: 'mooc' },
                { id: '2-1', name: '我的直播', url: 'live' },
                { id: '2-2', name: '我的考试', url: 'exam' },
                { id: '2-3', name: '我的班级', url: 'class' },
                { id: '2-4', name: '我的调研', url: 'train' }
            ] },
            { id: '3', name: '我的问吧', icon: 'icon-wen', url: 'bar' },
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
        img: { url: '../human/file/download?id=' }
    },
    callbacks: {
        init: function() {
            var me = this,
                recommendList = me.models.recommendList;
            recommendList.clear();
            recommendList.params = { page: '1' };
            me.get(recommendList);
        },
        changeRecommend: function() {
            var me = this,
                recommendList = me.models.recommendList,
                page = this.models.page.data.value;
            recommendList.params = { page: page };
            me.get(recommendList);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
