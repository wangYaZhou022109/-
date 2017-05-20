var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    types = {
        1: '课程',
        2: '专题',
        3: '考试',
        4: '调研',
        5: '班级',
        6: '直播'
    },
    timeDesc = {
        1: '学习起止时间',
        2: '学习起止时间',
        3: '进入考试时间',
        4: '调研时间',
        5: '班级起始时间',
        6: '直播时间'
    },
    button = {
        1: '开始学习|继续学习',
        2: '开始学习|继续学习',
        3: '开始考试',
        4: '开始调研',
        5: '进入班级',
        6: '进入直播'
    },
    url = {
        1: '#/study/course/detail/',
        2: '#/study/subject/detail/',
        3: '#/exam/exam/answer-paper/',
        4: '#/exam/research-activity/research-detail/',
        5: '#/',
        6: '#/activity/gensee/detail/'
    },
    getButton,
    getUrl;

exports.bindings = {
    tasks: true
};

exports.dataForTemplate = {
    tasks: function(data) {
        return _.map(data.tasks, function(task) {
            return D.assign(task, {
                typeDesc: types[task.businessType],
                timeDesc: timeDesc[task.businessType],
                button: getButton(task),
                url: getUrl(task)
            });
        });
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'tasks' }
}];

//  1：课程 2：专题
getButton = function(task) {
    var type = task.businessType;
    return (type === 1 || type === 2)
        ? button[type].split('|')[task.status === 1 ? 1 : 0] : button[type];
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
