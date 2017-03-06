
exports.items = {
    chart: 'chart',
    detail: 'detail'
};
exports.store = {
    models: {
        detailMenu: { data: [
            { id: '0', name: '课程', url: 'course' },
            { id: '1', name: '专题', url: 'course' },
            { id: '2', name: '班级', url: '' },
            { id: '3', name: '直播', url: '' },
            { id: '4', name: '考试', url: '' },
            { id: '5', name: '调研', url: '' },
            { id: '6', name: '知识', url: '' },
            { id: '7', name: '问道', url: '' },
            { id: '8', name: '证书', url: '' }
        ] },
        state: {
            data: {
                menu: 'course', // 初始菜单
                menuId: '0'
            }
        }
    }
};
