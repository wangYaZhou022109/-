
exports.items = {
    chart: 'chart',
    detail: 'detail'
};
exports.store = {
    models: {
        state: {
            data: {
                menu: 'course', // 初始菜单
                menuId: '0'
            }
        },
        detailMenu: { data: [
            { id: '0', name: '课程', url: 'course' },
            { id: '1', name: '专题', url: 'course' },
            { id: '2', name: '班级', url: 'class' },
            { id: '3', name: '直播', url: 'live' },
            { id: '4', name: '考试', url: 'exam' },
            { id: '5', name: '调研', url: 'research' },
            { id: '6', name: '知识', url: 'knowledge' },
            { id: '7', name: '问吧', url: 'ask' },
            { id: '8', name: '证书', url: 'certificate' }
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
