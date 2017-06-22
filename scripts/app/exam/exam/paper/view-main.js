var ANSWER_PAPER = 'exam/exam/answer-paper',
    SCORE_DETAIL = 'exam/exam/score-detail',
    EXAM_TIME_EXCEPTION = 4,
    WAIT_MARK_PAPER = 5,
    IS_FINISHED = 1,
    EXAM_PUBLISHING = 2;

exports.bindings = {
    exam: true
};

exports.afterRender = function() {
    var exam = this.bindings.exam.data,
        examRecord = exam.examRecord;

    if (exam.status === EXAM_PUBLISHING) {
        this.app.viewport.modal(this.module.items.tips, {
            tips: '试卷正在生成中，请稍后再试'
        });
        return true;
    }
    //  待评卷
    if (examRecord && examRecord.status === WAIT_MARK_PAPER) {
        return this.module.regions.main.show(SCORE_DETAIL, {
            examRecordId: examRecord.id
        });
    }
    //  试卷处理中
    if (examRecord && examRecord.status < EXAM_TIME_EXCEPTION && examRecord.submitTime) {
        this.app.viewport.modal(this.module.items.tips, {
            tips: '系统正在处理您的考卷，请稍后再试'
        });
        return true;
    }

    //  成绩查看
    if (examRecord && examRecord.status > EXAM_TIME_EXCEPTION && examRecord.isFinished === IS_FINISHED) {
        return this.module.regions.main.show(SCORE_DETAIL, {
            examRecordId: examRecord.id
        });
    }
    return this.module.regions.main.show(ANSWER_PAPER, {
        examId: exam.id
    });
};
