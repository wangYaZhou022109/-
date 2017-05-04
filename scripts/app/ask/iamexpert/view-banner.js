exports.bindings = {
    expert: true,
    down: false
};

exports.events = {
    'click change-topic-*': 'changetopic'
};
exports.handlers = {
    changetopic: function(payload) {
        var model = this.module.items['ask/changetopic'];
        this.app.viewport.modal(model, { id: payload });
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
