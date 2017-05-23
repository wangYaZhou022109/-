var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false,
    speech: true
};

exports.type = 'dynamic';

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

exports.getEntityModuleName = function() {
    return 'center/answer/question/operator';
};
exports.getEntity = function(id) {
    var question = _.find(this.bindings.list.data, { id: id });
    return {
        question: question,
        speech: this.bindings.speech.data,
        callback: function(payload) {
            this.module.dispatch('remove', payload);
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
