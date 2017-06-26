var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    helpers = require('./app/util/helpers'),
    getJoinStatus,
    getPassStatusStr,
    getShowCert,
    joinStatus = {
        1: '待开始',
        2: '待审核',
        3: '被拒绝',
        4: '已完成',
        5: '待考试',
        6: '未参加',
        7: '异常',
        8: ''
    };

exports.bindings = {
    exams: true,
    export: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}];

exports.dataForTemplate = {
    exams: function(data) {
        return _.map(data.exams, function(e, n) {
            return D.assign(e, {
                i: n + 1,
                totalScore: e.examRecord.totalScore / 100,
                score: e.examRecord.status > 4 ? e.examRecord.score / 100 : '-',
                joinStatus: getJoinStatus(e),
                submitTime: helpers.dateTime(e.examRecord.submitTime) || '-',
                passStatusStr: getPassStatusStr(e),
                showCert: getShowCert(e),
                passScore: e.passScore || '-'
            });
        });
    },
    exportUrl: function() {
        var url = this.bindings.export.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('access_token=' + token);
        return url;
    }
};

getJoinStatus = function(exam) {
    var currentTime = new Date().getTime();
    //  待开始
    if (exam.startTime > currentTime) return joinStatus['1'];
    //  待审核
    if (exam.signUp && exam.signUp.status === 1) return joinStatus['2'];
    //  被拒绝
    if (exam.signUp && exam.signUp.status === 3) return joinStatus['3'];
    //  已完成
    if (exam.examRecord.status > 4) return joinStatus['4'];
    //  待考试
    if (exam.startTime < currentTime
        && exam.endTime > currentTime
        && exam.examRecord.status === 1) return joinStatus['5'];
    //  未参加
    if (exam.endTime < currentTime && exam.examRecord.status === 1) return joinStatus['6'];
    //  异常
    if (exam.examRecord.status === 4) return joinStatus['7'];
    return joinStatus['8'];
};

getPassStatusStr = function(exam) {
    if (exam.passScore && exam.examRecord.status > 5) {
        return (exam.examRecord.score / 100) > exam.passScore ? '是' : '否';
    }
    return '-';
};

getShowCert = function(exam) {
    return exam.examRecord.status > 5 && exam.hasCert === 1;
};
