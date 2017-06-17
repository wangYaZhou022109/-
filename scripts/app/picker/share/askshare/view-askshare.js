exports.components = [function() {
    var pics = this.module.renderOptions.pics;
    var data = {
        id: 'chooseCover',
        name: 'picker',
        options: {
            picker: 'image-cropper',
            inputName: 'coverImage',
            width: 300,
            height: 200,
            defaultImg: pics,
            avatarSize: '250,160',
            data: { btnName: '选择封面', btnClass: 'block', defaultCss: 'exam-pic' }
        }
    };
    if (pics.indexOf('default_') < 0) data.options.data.value = pics;
    return data;
}];
