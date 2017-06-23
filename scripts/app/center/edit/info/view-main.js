var maps = require('./app/util/maps'),
    _ = require('lodash/collection');
exports.bindings = {
    member: false,
    topicList: true
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
            defaultImg: 'images/default-userpic.png',
            data: data
        }
    };
}, function() {
    var topics = [];
    var topicList = this.bindings.topicList.data;
    if (topicList) {
        _.map(topicList, function(opt) {
            var topic = opt;
            topics.push({
                value: topic.id,
                text: topic.name
            });
        });
    }
    return {
        id: 'select-topic',
        name: 'picker',
        options: {
            picker: 'topics',
            inputName: 'topicIds',
            limit: 10,
            type: 1,
            group: 1,
            tags: topics
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

exports.events = {
    'click detailed': 'detailed'
};

exports.handlers = {
    detailed: function() {
        var mod = this.module.items['center/edit/info/detailed'],
            me = this;
        me.app.viewport.modal(mod, { member: this.module.renderOptions.member });
    }
};
