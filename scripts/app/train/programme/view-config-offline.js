var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    themeList: true,
    state: false,
    weeks: true
};

exports.title = '配置主题';

exports.buttons = [{
    text: '保存',
    fn: function() {
        return this.module.dispatch('saveOfflineTheme');
    }
}];

exports.small = true;

exports.dataForTemplate = {
    weeks: function() {
        var weeks = this.bindings.weeks;
        _.map(weeks.data || [], function(week, i) {
            var r = week;
            r.i = i + 1;
        });
        return weeks.data;
    }
};

exports.events = {
    'click label-theme-offline-*': 'changeName',
    'change input-theme-offline-*': 'updateName'
};

exports.handlers = {
    changeName: function(id) {
        $(this.$('input-theme-offline-' + id)).css('display', 'block');
        $(this.$('label-theme-offline-' + id)).css('display', 'none');
    },
    updateName: function(id) {
        var val = $(this.$('input-theme-offline-' + id)).val();
        if (val === '') {
            this.app.message.alert('主题名称不能为空');
        } else {
            this.module.dispatch('updateOThemeName', { id: id, name: val });
        }
    }
};
