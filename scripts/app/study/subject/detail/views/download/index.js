exports.items = {
    pannel: 'pannel',
    'preview-pdf': '',
    'preview-img': '',
    'preview-video': '',
    'preview-audio': ''
};

exports.store = {
    models: {
        region: {},
        subject: {},
        down: {
            url: '../human/file/download'
        },
        preview: {
            url: '../human/file/preview'
        },
        attachment: { url: '../human/file' }
    },
    callbacks: {
        getAttachment: function(payload) {
            var attachment = this.models.attachment;
            attachment.set({ id: payload.id });
            return this.get(attachment);
        }
    }
};

exports.beforeRender = function() {
    this.store.models.region.set(this.renderOptions.region);
    this.store.models.subject.set(this.renderOptions.subject);
};
