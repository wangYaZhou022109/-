var options = require('./app/train/programme/research-activity/add-research-activity/steps/step-2/index'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    strings = require('./app/util/strings'),
    obj = D.assign({}, options),
    items = D.assign({}, obj.items),
    callbacks = D.assign({}, obj.store.callbacks),
    models = D.assign({}, obj.store.models),
    dimensionsMixin = D.assign({}, obj.store.models.dimensions.mixin);

obj.items = items;

D.assign(obj.items, {
    'picker/select-dimension': { isModule: true }
});

obj.store.models = models;

D.assign(obj.store.models, {
    batchDimension: { url: '../exam/dimension/batch-insert' }
});

obj.store.models.dimensions.mixin = dimensionsMixin;

D.assign(obj.store.models.dimensions.mixin, {
    batchInsert: function(dimensions) {
        var me = this,
            data = [];
        _.forEach(dimensions, function(d) {
            if (!_.find(me.data, ['name', d.name])) {
                D.assign(d, { order: me.data.length + 1 });
                me.data.push(d);
                data.push(d);
            }
        });
        return data;
    }
});

obj.store.callbacks = callbacks;
D.assign(obj.store.callbacks, {
    saveSelectDimension: function(payload) {
        var me = this,
            dimensions = this.models.dimensions;

        this.models.batchDimension.set({
            dimensions: JSON.stringify(dimensions.batchInsert(payload.dimensions))
        });

        return this.post(this.models.batchDimension).then(function() {
            me.models.dimensions.changed();
            me.app.message.success(strings.get('save-success'));
        });
    }
});

module.exports = obj;
