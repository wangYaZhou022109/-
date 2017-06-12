exports.components = [{
    id: 'chooseCover',
    name: 'picker',
    options: {
        picker: 'image-cropper',
        inputName: 'coverImage',
        width: 300,
        height: 200,
        defaultImg: 'images/default-cover/default_exam.jpg',
        avatarSize: '250,160',
        data: { btnName: '选择封面', btnClass: 'block', defaultCss: 'exam-pic' }
    }

}];
