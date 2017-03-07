exports.routes = {
    index: 'showIndex',
    management: 'showManagement',
    'management/list': 'showManagementList',
    'management/detail': 'showManagementDetail'

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
