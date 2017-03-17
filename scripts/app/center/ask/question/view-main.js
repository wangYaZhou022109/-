var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false
};

exports.actions = {
    'click delete*': 'delete'
};

exports.dataForActions = {
    delete: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除该问题?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    delete: function() {
        this.app.message.success('取消收藏成功');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl();
        _.map(list, function(opt) {
            var obj = opt;
            obj.member.headPortrait = !obj.member.headPortrait ? 'images/default-userpic.png' : downUrl + obj.member.headPortrait; // eslint-disable-line max-len
            obj.typeName = obj.type === '1' ? '·提问·' : '·分享·';
            obj.prefixText = helpers.dateMinute(obj.createTime);
            obj.discussTxt = '评论(' + obj.discussNum + ')';
            obj.contentImg = 'images/1.png';
        });
        return list;
    }
};
