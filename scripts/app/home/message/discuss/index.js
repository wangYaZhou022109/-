var D = require('drizzlejs');

exports.title = '@我的';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        list: {
            url: ''
        },
        img: { url: '../human/file/download?id=' },
        readStatus: { data: { value: '' } },
        removeAll: { url: '' },
        markRead: { url: '' },
        dataList: { data: [] }, // 用于拼接组合分页数据
        scrollFlag: { data: false }
    },
    callbacks: {
    }
};
