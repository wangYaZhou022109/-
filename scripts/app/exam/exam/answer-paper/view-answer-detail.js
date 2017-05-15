var D = require('drizzlejs');

exports.bindings = {
    state: true,
    exam: false,
    types: false,
    answer: false
};

exports.type = 'dynamic';

exports.getEntity = function() {
    var exam = this.bindings.exam.data,
        examRecord = exam.examRecord;

    return D.assign({}, {
        exam: D.assign(exam, {
            examRecord: D.assign(examRecord, {
                status: exam.paper.isSubjective === 1 ? 5 : 6 //  马上查看详情，初始化考试记录的状态
            })
        }),
        state: this.bindings.state.data,
        types: this.bindings.types.data,
        answer: this.bindings.answer.data,
    });
};

exports.getEntityModuleName = function() {
    return 'exam/exam/score-detail';
};

exports.dataForEntityModule = function(data) {
    return {
        data: data
    };
};
