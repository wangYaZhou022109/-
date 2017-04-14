exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        menus: { data: [
            { id: '0', name: '内容', url: 'question', current: true },
           // { id: '1', name: '话题', url: 'topic' },
          //  { id: '2', name: '专家', url: 'expert' }
        ] },
        state: {
            data: {
                menu: 'question', // 初始菜单
            }
        },
        img: { url: '../human/file/download?id=' }
    }
};
