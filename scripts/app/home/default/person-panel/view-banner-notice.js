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
    types = {
        1: '课程',
        2: '专题',
        3: '考试',
        4: '调研',
        5: '班级',
        6: '直播'
    },
    taskDefaultImage = {
        1: 'images/default-cover/default_course.jpg',
        2: 'images/default-cover/default_spceial.jpg',
        3: 'images/default-cover/default_exam.jpg',
        4: 'images/default-cover/default_survey.jpg',
        5: 'images/default-cover/default_class.jpg',
        6: 'images/default-cover/default_live.jpg'
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
                img: task.coverId || taskDefaultImage[task.businessType],
                typeDesc: '[' + types[task.businessType] + ']',
                url: getUrl(task)
            });
        });
        return t && t[0];
    },
    tasks: function(data) {
        var t = _.map(data.tasks.items, function(task) {
            return D.assign(task, {
                typeDesc: '[' + types[task.businessType] + ']',
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
