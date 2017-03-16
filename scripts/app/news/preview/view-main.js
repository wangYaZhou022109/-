var helpers = require('./app/util/helpers');
exports.bindings = {
    news: true
};

exports.dataForTemplate = {
    news: function(data) {
        var news = data.news;
        news.createTime = helpers.dateMinute(news.createTime);
        return news;
    }
};
