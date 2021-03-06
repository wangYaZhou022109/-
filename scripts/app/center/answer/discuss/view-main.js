var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false
};

exports.type = 'dynamic';

exports.actions = {
    'click remove-*': 'remove'
};

exports.dataForActions = {
    remove: function(data) {
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
    remove: function() {
        this.app.message.success('删除成功');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl(),
            textFont = { 0: 'color-ing', 2: 'color-error' };
        _.map(list, function(opt) {
            var obj = opt;
            obj.toMember.headPortrait = !obj.toMember.headPortrait ? 'images/default-userpic.png' : downUrl + obj.toMember.headPortrait; // eslint-disable-line max-len
            obj.prefixText = helpers.dateMinute(obj.createTime);
            obj.textFont = textFont[obj.auditStatus];
            obj.contentImg = 'images/1.png';
        });
        return list;
    }
};

exports.getEntityModuleName = function() {
    return 'center/answer/discuss/operator';
};
exports.getEntity = function(id) {
    var answer = _.find(this.bindings.list.data, { id: id }),
        me = this;
    return {
        answer: answer,
        // speech: this.bindings.speech.data,
        callback: function(payload) {
            me.module.dispatch('remove', payload);
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
