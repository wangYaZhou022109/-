var D = require('drizzlejs'),
    _ = require('lodash/collection');
exports.items = {
    toolbar: 'toolbar',
    viewer: 'viewer'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(options) {
            this.models.state.set(D.assign({}, options, {
                pageNum: 1,
                scale: 'page-width'
            }));
        },
        updatePage: function(payload) {
            var state = this.models.state;
            D.assign(state.data, payload);
            state.changed();
        },
        zoomInOut: function(payload) {
            var state = this.models.state.data,
                currentScale = payload.currentScale,
                currentIndex = 0,
                scaleIndex = 0;
            _.forEach(payload.scaleMap, function(scale, i) {
                if (Number(scale.key) === Number(currentScale) * 100) {
                    currentIndex = i;
                }
            });

            if (payload.type === 'in') {
                scaleIndex = currentIndex + 1;
                if (scaleIndex > payload.scaleMap.length) scaleIndex = payload.scaleMap.length;
            } else {
                scaleIndex = currentIndex - 1;
                if (scaleIndex < 0) scaleIndex = 0;
            }
            currentScale = payload.scaleMap[scaleIndex].key;
            state.scale = !isNaN(currentScale) ? Number(currentScale) / 100 : currentScale;
            this.models.state.changed();
            return state;
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    getData: function() {
        var pdf = this.items.viewer.components.viewerContainer;
        return { pageNum: pdf.currentPageNumber };
    }
};
