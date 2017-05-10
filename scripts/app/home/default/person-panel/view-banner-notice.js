exports.bindings = {
    newsList: true,
    personPanels: true
};

exports.dataForTemplate = {
    news: function(data) {
        return data.newsList && data.newsList[0];
    },
    newsList: function(data) {
        var newsList = data.newsList || [];
        return newsList.length > 0 && newsList.slice(1);
    }
};
