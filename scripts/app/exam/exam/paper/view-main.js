var ANSWER_PAPER = 'exam/exam/answer-paper',
    SCORE_DETAIL = 'exam/exam/score-detail',
    EXAM_TIME_EXCEPTION = 4,
    IS_FINISHED = 1;

exports.bindings = {
    exam: true
};

exports.afterRender = function() {
    var exam = this.bindings.exam.data,
        examRecord = exam.examRecord;
    if (examRecord && examRecord.status > EXAM_TIME_EXCEPTION && examRecord.isFinished === IS_FINISHED) {
        return this.module.regions.main.show(SCORE_DETAIL, {
            examRecordId: examRecord.id
        });
    }
    return this.module.regions.main.show(ANSWER_PAPER, {
        examId: exam.id
    });
};
