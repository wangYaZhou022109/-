var maps = require('./app/util/maps'),
    _ = require('lodash/collection');
exports.bindings = {
    member: false
};

exports.components = [function() {
    var data = {},
        member = this.bindings.member;
    if (member.data.memberDetail) data.value = member.data.memberDetail.headPortrait;
    return {
        id: 'headFile',
        name: 'picker',
        options: {
            picker: 'upload-head',
            inputName: 'headPortrait',
            btnName: '修改头像',
            data: data
        }
    };
}];

exports.dataForTemplate = {
    sexs: function() {
        var me = this,
            sexs = _.map(maps.get('sexs'), function(t) {
                var type = t;
                type.selected = Number(type.key) === Number(me.bindings.member.data.sex);
                return type;
            });
        return sexs;
    }
};
