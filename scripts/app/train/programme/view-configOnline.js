var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    themeList: true,
    state: false
};

exports.dataForTemplate = {
    themeList: function(data) {
        var state = this.bindings.state;
        _.map(data.themeList || [], function(theme, i) {
            var r = theme;
            r.i = i + 1;
        });
        state.changed();
        return data.themeList;
    }
};

exports.actions = {
    'click saveTheme': 'saveTheme'
};

exports.dataForActions = {

};

exports.actionCallbacks = {
    showOnlineTheme: function() {
        this.app.viewport.modal(this.module.items.configOnline);
    },
    saveTheme: function() {
        this.app.viewport.closeModal();
    }
};

exports.events = {
    'click move-theme-up-*': 'moveUp',
    'click move-theme-down-*': 'moveDown',
    'click label-theme-*': 'changeName',
    'change input-theme-*': 'updateName',
    'click del-theme-*': 'delTheme',
    'click addTheme': 'addTheme'
};

exports.handlers = {
    moveUp: function(id) {
        this.module.dispatch('moveUp', id);
    },
    moveDown: function(id) {
        this.module.dispatch('moveDown', id);
    },
    changeName: function(id) {
        $(this.$('input-theme-' + id)).css('display', 'block');
        $(this.$('label-theme-' + id)).css('display', 'none');
    },
    updateName: function(id) {
        var val = $(this.$('input-theme-' + id)).val();
        if (val === '') {
            this.app.message.alert('主题名称不能为空');
        } else {
            this.module.dispatch('updateName', { id: id, name: val });
        }
    },
    delTheme: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此主题吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('delTheme', id);
            }, function() {
                resolve(false);
            });
        });
    },
    addTheme: function() {
        this.module.dispatch('addTheme', '新的主题');
    }
};
