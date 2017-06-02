exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        knowledge: {},
        attachment: { url: '../human/file' }
    },
    callbacks: {
        init: function(payload) {
            var knowledge = this.models.knowledge,
                attachment = this.models.attachment;
            knowledge.set(payload);
            attachment.set({ id: payload.resourceId });
            return this.get(attachment);
        }
    }
};
exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
