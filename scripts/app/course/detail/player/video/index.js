var D = require('drizzlejs');

exports.items = {
    video: 'video'
};

exports.store = {
    models: {
        section: {},
        sectionProgress: {},
        download: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var section = this.models.section,
                sectionProgress = this.models.sectionProgress,
                download = this.models.download;
            section.set(payload.section);
            sectionProgress.set(payload.sectionProgress);
            D.assign(section.data, { url: download.getFullUrl() });
        },
        updateProgress: function() {
            // console.log(payload);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
