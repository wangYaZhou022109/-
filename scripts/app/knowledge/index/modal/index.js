exports.items = {
    main: 'main',
    upload: ''
};

exports.title = '上传知识';

exports.buttons = [
    { text: '保存', fn: function() { } }
];

exports.store = {
    models: {
        file: { url: '../human/file/upload-parse-file' }
    }
};

