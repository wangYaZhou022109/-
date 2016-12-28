exports.items = {
    audio: 'audio'
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
                sectionProgress = this.models.sectionProgress;
            section.set(payload.section);
            sectionProgress.set(payload.sectionProgress);
        },
        updatePregress: function() {
            // console.log(payload);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
