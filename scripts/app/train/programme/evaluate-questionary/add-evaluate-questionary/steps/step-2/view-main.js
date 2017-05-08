var options = require('./app/train/programme/research-activity/add-research-activity/steps/step-2/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    events = D.assign({}, obj.events),
    handlers = D.assign({}, obj.handlers);

D.assign(obj, {
    HIDE_SCORE: false,
    OPTION_SCORE_MODE: 1,
    SOURCE_TYPE: 4
});

obj.events = events;
D.assign(obj.events, {
    'click select-dimension': 'selectDimension'
});

obj.handlers = handlers;
D.assign(obj.handlers, {
    selectDimension: function() {
        var mod = this.module.items['train/programme/evaluate-questionary/select-dimension'],
            me = this;
        this.app.viewport.modal(mod, {
            callback: function(data) {
                return me.module.dispatch('saveSelectDimension', { dimensions: data });
            }
        });
    }
});
module.exports = obj;
