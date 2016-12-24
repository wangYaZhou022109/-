exports.bindings = {
    course: true
};

exports.actions = {
    'click register': 'register'
};

exports.actionCallbacks = {
    register: function() {
        this.app.message.success('注册成功');
        this.bindings.course.data.register = true;
        this.bindings.course.changed();
    }
};
