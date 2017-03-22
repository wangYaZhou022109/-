var helpers = require('./app/util/helpers');
exports.bindings = {
    subjectNews: true,
    homeNews: true
};

exports.dataForTemplate = {
    news: function(data) {
        var news = this.module.renderOptions.type === '0' ? data.homeNews : data.subjectNews;
        news.createTime = helpers.dateMinute(news.createTime);
        news.author = news.member ? news.member.fullName : news.author;
        return news;
    }
};
