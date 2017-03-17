exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        particularss: {
            url: '../train/trainee/particularss',
            type: 'pageable',
            root: 'items'
        }
    },
    callbacks: {
        init: function(payload) {
            var particularss = this.models.particularss;
            particularss.params = payload;
            return this.get(particularss);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { memberId: this.renderOptions.memberId });
};
