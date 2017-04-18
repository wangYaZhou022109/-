var _ = require('lodash/collection');
exports.bindings = {
    list: true,
    topicType: true,
    img: false
};

exports.events = {
};

exports.handlers = {
};

exports.actions = {
};

exports.dataForActions = {
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl();
        _.map(list, function(opt) {
            var obj = opt;
            obj.member.headPortrait = !obj.member.headPortrait ? 'images/default-userpic.png' : downUrl + obj.member.headPortrait; // eslint-disable-line max-len
            if (obj.introduce && obj.introduce.length > 24) {
                obj.introduce = obj.introduce.substring(0, 22) + '...';
            }
        });
        return list;
    }
};
