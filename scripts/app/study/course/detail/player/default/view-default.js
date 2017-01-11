exports.bindings = {
    state: false
};

exports.events = {
    'click register': 'register'
};

exports.handlers = {
    register: function() {
        this.module.renderOptions.register();
    }
};

exports.dataForTemplate = {
    loading: function(data) {
        if (!data.state.state.id) { // 如果课程未加载完毕
            return true;
        }
        return false;
    }
};
