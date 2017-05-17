exports.items = {
    main: 'main'
};

exports.title = '学习详情';

exports.store = {
    models: {
        particularss: {
            url: '../train/study-details/details'
        }
    },
    callbacks: {
        init: function(payload) {
            var particularss = this.models.particularss;
            particularss.params = payload.payload;
            return this.get(particularss);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { payload: this.renderOptions.payload });
};
