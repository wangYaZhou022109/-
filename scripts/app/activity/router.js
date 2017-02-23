exports.routes = {
    index: 'showIndex',
    'research-activity/:id': 'showResearchActivity'
};

exports.showIndex = function() {
    return this.app.show('content', 'activity/index');
};

exports.showResearchActivity = function(targetId) {
    return this.app.show('content', 'activity/research-activity', { researchQuestionaryId: targetId });
};
