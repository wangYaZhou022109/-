exports.items = {
    main: 'main'
};

exports.large = true;

exports.store = {
    models: {
        situation: { url: '../train/class-quota/situation' }
    },
    callbacks: {
        init: function(payload) {
            var situation = this.models.situation;
            situation.clear();
            situation.params = payload;
            return this.get(situation);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { classId: this.renderOptions.classId });
};
