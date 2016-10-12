exports.items = {
    number: 'number'
};

exports.store = {
    models: {
        entity: { url: '../human/extention/value' }
    },
    callbacks: {
        init: function(payload) {
            this.get(this.models.entity, { data: payload });
        }
    }
};

exports.afterRender = function() {
    if (this.renderOptions.objId) {
        this.dispatch('init', { extentionId: this.renderOptions.extention.id, objId: this.renderOptions.objId });
    }
};
