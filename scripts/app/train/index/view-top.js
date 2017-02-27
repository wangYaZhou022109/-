
exports.bindings = {
    projectInfo: true,
    state: true
};

exports.events = {
    'click menu-*': 'changeMenu'
};

exports.handlers = {
    changeMenu: function(menu) {
        var state = this.bindings.state,
            id = this.bindings.state.data.id,
            projectInfo = this.bindings.projectInfo.data;
        if (projectInfo.status === 3 || menu === 'book') {
            state.data = {};
            state.data.menu = menu || 'book';
            state.data[menu] = true;
            state.data.id = id;
            state.changed();
        } else {
            this.app.message.alert('当前计划为未通过状态');
        }
    }
};

exports.dataForTemplate = {

};
