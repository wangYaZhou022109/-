exports.bindings = {
    findUser: true
};

exports.components = [function() {
    var data = {},
        user = this.bindings.findUser.data;
    if (user) data.value = user.headPortrait;
    return {
        id: 'headFile',
        name: 'picker',
        options: {
            picker: 'upload',
            inputName: 'headPortrait',
            data: data
        }
    };
}];
