exports.bindings = {
    knowledge: true,
    download: false
};
exports.components = [
    function() {
        var knowledge = this.bindings.knowledge.data,
            download = this.bindings.download,
            url;
        url = download.getFullUrl() + '?id=' + knowledge.resourceId;
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
