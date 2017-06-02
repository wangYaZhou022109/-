var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    url = {
        1: '#/study/course/detail/',
        2: '#/study/subject/detail/',
        3: '#/exam/exam/answer-paper/',
        4: '#/exam/research-activity/research-detail/',
        5: '#/',
        6: '#/activity/gensee/detail/'
    },
    getUrl;

exports.bindings = {
    newsList: true,
    personPanels: true,
    tasks: true
};

exports.dataForTemplate = {
    news: function(data) {
        return data.newsList && data.newsList[0];
    },
    newsList: function(data) {
        var newsList = data.newsList || [];
        return newsList.length > 0 && newsList.slice(1);
    },
    task: function(data) {
        var t = _.map(data.tasks.items, function(task) {
            return D.assign(task, {
                url: getUrl(task)
            });
        });
        return t && t[0];
    },
    tasks: function(data) {
        var t = _.map(data.tasks.items, function(task) {
            return D.assign(task, {
                url: getUrl(task)
            });
        });
        return t.length > 0 && t.slice(1);
    }
};

//  调研的url  特殊情况
getUrl = function(task) {
    if (!task.url) {
        return task.businessType === 4
            ? (url[task.businessType] + task.businessId + '/' + task.businessId)
                : url[task.businessType] + task.businessId;
    }
    return task.url;
};
