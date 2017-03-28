exports.bindings = {
    state: true
};

exports.events = {
    'click switch-*': 'switchMenu',
    'click waitTodo-*': 'waitTodo'
};

exports.handlers = {
    switchMenu: function(id) {
        return this.module.dispatch('switchMenu', {
            menu: id,
            satisfaction: id === 'satisfaction',
            markpaper: id === 'mark-paper',
            homework: id === 'homework'
        });
    },
    waitTodo: function(id, target) {
        return this.module.dispatch('waitTodo', {
            wait: target.target.checked ? 1 : 0
        });
    }
};

exports.dataForTemplate = {
    waitTodo: function(data) {
        if (data.state.satisfaction) return '仅显示待处理';
        if (data.state.markpaper) return '显示待评卷';
        if (data.state.homework) return '显示待审核';
        return '';
    }
};
