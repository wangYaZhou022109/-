exports.title = '积分等级';

exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        gradeList: { url: '../system/integral/grade-list', autoLoad: 'after' },
        down: { url: '../human/file/download' },
    }
};
