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
            { id: '0', name: '我的任务', icon: 'icon-task', url: 'task' },
            { id: '1', name: '我的学习', icon: 'icon-type', url: 'study', childs: [ // eslint-disable-line object-property-newline,max-len
                { id: '1-0', name: '我的课程', url: 'study/course' },
                { id: '1-1', name: '我的专题', url: 'study/subject' },
                { id: '1-2', name: '我的知识', url: 'study/knowledge' },
                { id: '1-3', name: '岗位学习', url: 'study/jobs' }
            ] },
            { id: '2', name: '我的活动', icon: 'icon-tag-1', url: 'activity', childs: [ // eslint-disable-line object-property-newline,max-len
                { id: '2-0', name: '我的mooc', url: 'mooc' },
                { id: '2-1', name: '我的直播', url: 'live' },
                { id: '2-2', name: '我的班级', url: 'class' },
                { id: '2-3', name: '我的调研', url: 'research' }
            ] },
            { id: '3', name: '我的问吧', icon: 'icon-wen', url: 'bar' },
            { id: '4', name: '我的收藏', icon: 'icon-favorite', url: 'collection' },
            { id: '5', name: '我的档案', icon: 'icon-file', url: 'archives' }
        ] },
        state: {
            data: {
                menu: 'archives', // 初始菜单
            }
        }
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
