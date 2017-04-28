var options = require('./app/train/programme/research-activity/add-research-activity/steps/step-2/view-side'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    events = D.assign({}, obj.events),
    handlers = D.assign({}, obj.handlers);

D.assign(obj, {
    HIDE_SCORE: false,
    SOURCE_TYPE: 4
});

obj.events = events;
D.assign(obj.events, {
    'click select-dimension': 'selectDimension'
});

obj.handlers = handlers;
D.assign(obj.handlers, {
    selectDimension: function() {
        var mod = this.module.items['picker/select-dimension'],
            me = this;
        this.app.viewport.modal(mod, {
            callback: function(data) {
                return me.module.dispatch('saveSelectDimension', { dimensions: data });
            }
        });
    }
});

module.exports = obj;
