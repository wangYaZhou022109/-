var _ = require('lodash/collection');

exports.bindings = {
    fmtrainees: true
};

exports.events = {
    'click addTrainee': 'showMembers'
};

exports.handlers = {
    showMembers: function() {
        var me = this,
            model = me.module.items['train/trainee/fmtrainee/select-member'];
        me.app.viewport.ground(model, {
            callback: function() {
            }
        });
    }
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'fmtrainees' }
}];

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var fmtrainees = data.fmtrainees,
            pageNum = this.bindings.fmtrainees.getPageInfo().page;
        fmtrainees.isGroup = false;
        _.forEach(fmtrainees, function(f) {
            if (f.traineeGroup.id) {
                fmtrainees.isGroup = true;
            }
        });
        _.map(fmtrainees || [], function(fmtrainee, i) {
            var e = fmtrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return fmtrainees;
    }
};
