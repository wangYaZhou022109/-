exports.bindings = {
    state: true
};

exports.events = {
    'click switch-*': 'switchMenu'
};

exports.handlers = {
    switchMenu: function(id) {
        return this.module.dispatch('switchMenu', {
            menu: id,
            satisfaction: id === 'satisfaction',
            markpaper: id === 'mark-paper',
            homework: id === 'homework'
        });
    }
};
