var ANSWER_PAPER = 'exam/exam/answer-paper',
    SCORE_DETAIL = 'exam/exam/score-detail';

exports.bindings = {
    exam: true
};

exports.afterRender = function() {
    var exam = this.bindings.exam.data,
        examRecord = exam.examRecord;
    if (examRecord && examRecord.status > 4) {
        return this.module.regions.main.show(SCORE_DETAIL, {
            examRecordId: examRecord.id
        });
    }
    return this.module.regions.main.show(ANSWER_PAPER, {
        examId: exam.id
    });
};
