exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        menus: { data: [
            { id: '0', name: '提问', url: 'question', current: true },
            { id: '1', name: '分享', url: 'question' },
            { id: '2', name: '回答', url: 'discuss' }
        ] },
        state: {
            data: {
                menu: 'question', // 初始菜单
            }
        },
        img: { url: '../human/file/download?id=' }
    }
};
