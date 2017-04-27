var $ = require('jquery'),
    getProperties;
// exports.type = 'form';
exports.bindings = {
    table: true,
    currentTactic: true
};

exports.events = {
    'change input-*': 'setTacticAmount',
    'click item-*': 'triggetTactic',
    'click edit-popup-*': 'editPopup',
    'click save-tactic-*': 'saveTactic',
    'click remove-tactic-*': 'removeTactic',
    'click cancel': 'closeSettingPopup'
};
getProperties = function(id) {
    return {
        organizationId: id.split('|')[0],
        questionDepotId: id.split('|')[1],
        type: Number(id.split('|')[2]),
        difficulty: Number(id.split('|')[3])
    };
};
exports.handlers = {
    editPopup: function(id) {
        var me = this,
            properties = getProperties(id);
        me.module.dispatch('getTactic', properties).then(function(value) {
            var tactic = value;
            if (!tactic) {
                tactic = properties;
                tactic.amount = 0;
                tactic.score = 0;
            }
            me.module.dispatch('setCurrentTactic', tactic);
        });
    },
    saveTactic: function(id) {
        var me = this,
            tactic = getProperties(id);
        tactic.amount = Number($(this.$('popupAmount')).val());
        tactic.score = Number($(this.$('popupScore')).val());
        if (!this.validate()) return;
        me.module.dispatch('clearCurrentTactic');
        me.module.renderOptions.saveTactic(tactic).then(function() {
            me.module.reload();
        });
    },
    removeTactic: function(id) {
        this.module.renderOptions.removeTactic(getProperties(id));
        this.module.reload();
    },
    closeSettingPopup: function() {
        $(this.$('setting-popup')).hide().removeClass('show');
    }
};
