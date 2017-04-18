var RESEARCH_DETAIL = 'exam/research-activity/research-detail',
    RESEARCH_ANSWER = 'exam/research-activity/research-answer',
    FINISHED = 1;

exports.bindings = {
    research: true
};

exports.afterRender = function() {
    var research = this.bindings.research.data,
        record = research.researchRecord;
    if (record && record.status === FINISHED) {
        return this.module.regions.main.show(RESEARCH_ANSWER, {
            researchRecordId: record.id
        });
    }
    return this.module.regions.main.show(RESEARCH_DETAIL, {
        researchQuestionaryId: research.id,
        businessId: this.bindings.research.params.businessId
    });
};
