
exports.items = {
    player: 'player',
    title: 'title'
};

exports.store = {
    models: {
        section: {},
        download: { url: '../human/file' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var download = this.models.download,
                state = this.models.state;
            state.set(payload);
            download.set(payload);
            this.get(download).then(function(data) {
                var file = data[0];
                if (file.extention === 'mp3') {
                    state.data.key = 'audio';
                } else if (file.extention === 'mp4') {
                    state.data.key = 'video';
                } else {
                    state.data.key = 'pdf';
                }
                state.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { id: this.renderOptions.id });
};
