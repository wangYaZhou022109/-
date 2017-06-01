var _ = require('lodash/collection'),
    maps = require('./app/util/maps');

exports.bindings = {
    detail: true,
    levels: true,
    state: false
};

exports.dataForTemplate = {
    levels: function(data) {    // 职级下拉框
        var levelId = data.detail.levelId || '';
        var levels = data.levels;
        _.map(levels, function(level) {
            var l = level;
            if (l.id === levelId) {
                l.selected = true;
            }
        });
        return levels;
    },
    sexs: function(data) {       // 性别下拉框
        var sexs = _.map(maps.get('sexs'), function(t) {
            var sex = t;
            sex.selected = Number(sex.key) === Number(data.detail.sex);
            return sex;
        });
        return sexs;
    }
};

exports.buttons = [{
    text: '保存',
    fn: function(payload) {
        var me = this;
        var state = me.bindings.state.data;
        this.module.dispatch('updateTrainee', payload).then(function(ret) {
            if (ret[0]) {
                me.app.message.success('保存成功！');
                me.module.dispatch('init', state);
            } else {
                me.app.message.success('保存失败！');
            }
        });
    }
}];
