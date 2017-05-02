var maps = require('./app/util/maps'),
    $ = require('jquery');
exports.bindings = {
    detail: true
};

exports.components = [{
    id: 'rankingRule',
    name: 'selectize'
}];
exports.dataForTemplate = {
    rankingRule: function() {
        return maps.get('display-rule');
    },
    detail: function(data) {
        var detail = data.detail;
        detail.type = false;
        if (detail.showRanking === 1) {
            detail.type = true;
        }
        return detail;
    }
};
exports.events = {
    'click detail_*': 'en'
};
exports.handlers = {
    en: function(data, e, target) {
        var value = target.getAttribute('value');
        var detail = this.bindings.detail;
        var notice = $(this.$('notice')).val();
        detail.data.showRanking = parseInt(value, 10);
        detail.data.notice = notice;
        this.bindings.detail.changed();
    }
};
exports.actions = {
    'click saveBulletin': 'saveBulletin'
};
exports.dataForActions = {
    saveBulletin: function(data) {
        return data;
    }
};
