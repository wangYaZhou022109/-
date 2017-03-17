exports.bindings = {
    knowledge: true,
    download: false,
    recommends: true
};
exports.dataForTemplate = {
    downUrl: function(data) {
        return this.bindings.download.getFullUrl() + '?id=' + data.knowledge.resourceId;
    }
};
exports.actions = {
    'click changeRecommends': 'changeRecommends'
};
