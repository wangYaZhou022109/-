
exports.items = {
    chart: 'chart',
    detail: 'detail',
    'center/archives/course': { isModule: true }
};
exports.store = {
    models: {
        state: {},
        detailMenu: { data: [
            { id: '1', name: '课程', item: 'center/archives/course' },
            { id: '2', name: '专题', item: 'center/archives/course' },
            { id: '3', name: '班级', item: '' },
            { id: '4', name: '直播', item: '' },
            { id: '5', name: '考试', item: '' },
            { id: '6', name: '调研', item: '' },
            { id: '7', name: '知识', item: '' },
            { id: '8', name: '问道', item: '' },
            { id: '9', name: '证书', item: '' }
        ] },
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'archives';
            state.data.archives = true;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
