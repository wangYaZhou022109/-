
exports.items = {
    condition: 'condition',
    chart: 'chart',
    detail: 'detail',
    'center/integral': { isModule: true }
};
exports.store = {
    models: {
        state: {
            data: {
                menu: 'course', // 初始菜单
                menuId: '0'
            }
        },
        detailMenu: { data: [ // 菜单id一定要按索引顺序
            { id: '0', name: '课程', url: 'course' },
            { id: '1', name: '专题', url: 'course' },
            // { id: '2', name: '班级', url: 'class' },
            { id: '2', name: '直播', url: 'live' },
            { id: '3', name: '考试', url: 'exam' },
            { id: '4', name: '调研', url: 'research' },
            { id: '5', name: '知识', url: 'knowledge' },
            { id: '6', name: '问吧', url: 'ask' },
            { id: '7', name: '证书', url: 'certificate' }
        ] },
        statistics: { url: '../course-study/course-study-progress/statistics', autoLoad: 'after' }
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'archives';
            state.data.archives = true;
        },
        search: function(payload) {
            return this.get(this.models.statistics, { data: payload });
        }
    }
};
