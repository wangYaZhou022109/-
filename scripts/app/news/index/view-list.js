var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    newsPages: true
};

exports.dataForTemplate = {
    newsPages: function(data) {
        _.map(data.newsPages || [], function(news) {
            var r = news;
            r.createTime = helpers.dateMinute(r.createTime);
            r.author = r.member ? r.member.fullName : r.author;
        });
        return data.newsPages;
    }
};


exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'newsPages' }
}];
