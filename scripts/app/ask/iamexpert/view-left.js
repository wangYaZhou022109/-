
exports.type = 'dynamic';

exports.bindings = {
    leftstate: true,
    expert: true,
    down: false
};

exports.events = {
    'click menu-*': 'showMenu',
    'click item-*': 'showMenu',
    'click change-topic-*': 'changetopic',
    'click right*': 'showRight',
    'click editsummary*': 'showEditsummary'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.leftstate,
            expert = this.bindings.expert;
        state.data = {};
        state.data.id = expert.data.member.id;
        state.data.menu = menu || 'inviteanswer';
        state.data[menu] = true;
        state.changed();
    },
    changetopic: function(payload) {
        var model = this.module.items['ask/changetopic'];
        var topicList = this.bindings.expert.data.topicList;
        this.app.viewport.modal(model, { id: payload, topicList: topicList });
    },
    showRight: function(payload) {
        var model = this.module.items['ask/expert/right'];
        this.app.viewport.modal(model, { id: payload });
    },
    showEditsummary: function() {
        var model = this.module.items['ask/expert/editsummary'];
        var expert = this.bindings.expert.data;
        this.app.viewport.modal(model, { expert: expert });
    }
};
exports.dataForTemplate = {
    expert: function(data) {
        var expert = data.expert,
            url = { };
        if (typeof expert.member !== 'undefined') {
            url = expert.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                expert.member.headPortrait = 'images/default-userpic.png';
            } else {
                expert.member.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
            }
        }
        return expert;
    }
};
exports.getEntityModuleName = function(key) {
    var url = this.bindings.leftstate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    var me = this;
    return {
        state: this.bindings.leftstate.data,
        callback: function() {
            me.module.dispatch('refresh');
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
