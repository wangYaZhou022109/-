exports.routes = {
    index: 'showIndex',
    'research-activity/:id': 'showResearchActivity',
    'live-details': 'showLiveDetails',
    'class-details': 'showClassDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'activity/index');
};

exports.showResearchActivity = function(targetId) {
    return this.app.show('content', 'activity/research-activity', { researchQuestionaryId: targetId });
};

exports.showLiveDetails = function() {
    return this.app.show('content', 'activity/live-details');
};

exports.showClassDetails = function() {
    return this.app.show('content', 'activity/class-details');
};
