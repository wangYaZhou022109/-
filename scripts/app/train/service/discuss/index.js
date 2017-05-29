exports.items = {
    comment: 'comment',
};

exports.store = {
    models: {
        state: {},
        classInfo: {
            url: '../train/class-info/get'
        }
    },
    callbacks: {
        init: function(payload) {
            var classInfo = this.models.classInfo;
            classInfo.params.id = payload.id;
            return this.get(classInfo);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.classId });
};
