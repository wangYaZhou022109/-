exports.events = {

};

exports.handlers = {

};

exports.components = [function() {
    var btnName = '设置封面';
    return {
        id: 'headFile',
        name: 'picker',
        options: {
            picker: 'upload',
            inputName: 'coverUrl',
            data: {
                btnName: btnName,
                btnClass: 'block',
                defaultCss: 'exam-pic',
                value: '',
                width: 150,
                height: 150
            }
        }
    };
}];
