exports.bindings = {
    expert: true
};

exports.components = [function() {
    var data = {},
        expert = this.bindings.expert.data;
    if (expert.member) data.value = expert.member.headPortrait;
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
