exports.title = '我的消息';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        menus: { data: [
            { id: '0', name: '通知', url: 'notice', current: true },
            { id: '1', name: '待办', url: 'wait' },
            { id: '2', name: '@我的', url: 'discuss' }
        ] },
        state: {
            data: {
                menu: 'notice', // 初始菜单
            }
        }
    }
};
