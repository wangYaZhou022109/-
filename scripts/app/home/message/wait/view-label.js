var _ = require('lodash/collection');

exports.bindings = {
    state: true,
    menus: true,
    finishStatus: true
};
exports.events = {
    'click switch-*': 'switchMenu',
    'click checkFinish': 'checkFinish'
};

exports.afterRender = function() {
    var me = this,
        currentMenu = me.bindings.state.data.menu,
        finishStatus = me.bindings.finishStatus.data.value;
    if (currentMenu === 'satisfaction') {
        me.module.regions.content.show(me.module.items.satisfaction, { finishStatus: finishStatus });
    } else if (currentMenu === 'evaluation') {
        me.module.regions.content.show(me.module.items.evaluation, { finishStatus: finishStatus });
    } else if (currentMenu === 'homework') {
        me.module.regions.content.show(me.module.items.homework, { finishStatus: finishStatus });
    }
};

exports.handlers = {
    switchMenu: function(menuId) {
        var menus = this.bindings.menus.data,
            menu = this.bindings.menus.data[menuId],
            state = this.bindings.state,
            currentMenu = menu.url;
        state.data.menu = currentMenu;
        _.forEach(menus, function(m) {
            var obj = m;
            if (obj.id === menuId) {
                obj.current = true;
            } else {
                obj.current = false;
            }
        });
        this.bindings.finishStatus.data.value = '0'; // 勾选去掉
        this.bindings.menus.changed();
    },
    checkFinish: function() { // 是否未只显示待处理项
        if (this.$('checkFinish').checked) {
            this.bindings.finishStatus.data.value = '1';
        } else {
            this.bindings.finishStatus.data.value = '0';
        }
        this.bindings.finishStatus.changed();
    }
};

exports.dataForTemplate = {
    finishCheck: function(data) { // 是否勾选只读
        var finishStatus = data.finishStatus.value;
        if (finishStatus === '1') {
            return true;
        }
        return false;
    }
};
