exports.routes = {
    index: 'showIndex',
    management: 'showManagement',
    'management/list': 'showManagementList',
    'management/detail': 'showManagementDetail',
    'detail/ask': 'showDetailAsk',
    'detail/article': 'showDetailArticle',
    'topic/index': 'showTopicIndex',
    'topic/detail': 'showTopicDetail',
    'expert/index': 'showExpertIndex',
    'expert/detail': 'showExpertDetail'

};

exports.showIndex = function() {
    return this.app.show('content', 'ask-new/index');
};

exports.showManagement = function() {
    return this.app.show('content', 'ask-new/management');
};

exports.showManagementList = function() {
    return this.app.show('content', 'ask-new/management/list');
};

exports.showManagementDetail = function() {
    return this.app.show('content', 'ask-new/management/detail');
};

exports.showDetailAsk = function() {
    return this.app.show('content', 'ask-new/detail/ask');
};

exports.showDetailArticle = function() {
    return this.app.show('content', 'ask-new/detail/article');
};

exports.showTopicIndex = function() {
    return this.app.show('content', 'ask-new/topic/index');
};

exports.showTopicDetail = function() {
    return this.app.show('content', 'ask-new/topic/detail');
};

exports.showExpertIndex = function() {
    return this.app.show('content', 'ask-new/expert/index');
};

exports.showExpertDetail = function() {
    return this.app.show('content', 'ask-new/expert/detail');
};
