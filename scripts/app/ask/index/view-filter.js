exports.bindings = {
    params: true,
    state: true
};

exports.events = {
    'click filter-menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        // var content = this.$('filter-menu-content'),
        //     topic = this.$('filter-menu-topic'),
        //     expert = this.$('filter-menu-expert'),
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu || 'content';
        state.data[menu] = true;
        state.changed();
        // topic.className = 'active';
        // if (menu === 'content') {
        //     content.className = 'active';
        //     topic.className = '';
        //     expert.className = '';
        // } else if (menu === 'topic') {
        //     topic.className = 'active';
        //     content.className = '';
        //     expert.className = '';
        // } else if (menu === 'expert') {
        //     expert.className = 'active';
        //     topic.className = '';
        //     content.className = '';
        // } else {
        //     content.className = 'active';
        //     topic.className = '';
        //     expert.className = '';
        // }
    }
};
