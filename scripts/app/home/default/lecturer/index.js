exports.items = {
    lecturer: 'lecturer'
};
exports.store = {
    models: {
        lecturers: { url: '../train/home-lecturer' }
    },
    callbacks: {
        init: function(payload) {
            var lecturers = this.models.lecturers;
            lecturers.clear();
            lecturers.params.moduleHomeConfigId = payload.id;
            lecturers.params.size = payload.size || 6;
            return this.get(lecturers);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
