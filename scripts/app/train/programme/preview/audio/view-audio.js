exports.bindings = {
    state: false,
    download: false
};

exports.components = [
    function() {
        var id = this.bindings.state.data.id,
            download = this.bindings.download,
            url;
        url = download.getFullUrl() + '?id=' + id;
        return {
            id: 'waveform',
            name: 'audio-waveform',
            options: {
                url: url,
                opt: {
                    height: 400,
                    barWidth: 2,
                    cursorWidth: 0,
                }
            }
        };
    }
];

exports.events = {
    'click playPause': 'playPause',
};

exports.handlers = {
    playPause: function() {
        this.components.waveform.playPause();
    }
};

