exports.bindings = {
    section: true,
    sectionProgress: true,
    time: false
};
exports.dataForTemplate = {
    url: function(data) {
        var url = data.section.url;
        if (!url.startsWith('http')) {
            url = '//' + url;
        }
        return url;
    }
};
