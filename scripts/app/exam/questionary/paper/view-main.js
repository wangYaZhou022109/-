var RESEARCH_DETAIL = 'exam/research-activity/research-detail',
    RESEARCH_ANSWER_DETAIL = 'exam/research-activity/research-answer-detail',
    RESEARCH_SUMMARY_DETAIL = 'exam/research-activity/research-summary-detail',
    FINISHED = 1,
    PERMIT_VIEW_COUNT = 1;

exports.bindings = {
    research: true
};

exports.afterRender = function() {
    var research = this.bindings.research.data,
        record = research.researchRecord;

    if (record && record.status === FINISHED) {
        if (research.permitViewCount === PERMIT_VIEW_COUNT) {
            return this.module.regions.main.show(RESEARCH_SUMMARY_DETAIL, {
                researchRecordId: record.id
            });
        }
        return this.module.regions.main.show(RESEARCH_ANSWER_DETAIL, {
            researchRecordId: record.id
        });
    }
    return this.module.regions.main.show(RESEARCH_DETAIL, {
        researchQuestionaryId: research.id
    });
};
