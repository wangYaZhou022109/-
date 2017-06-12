exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        section: {},
        scormTree: { url: '../course-study/course-file/scorm/tree' },
        attachment: { url: '../human/file' }
    },
    callbacks: {
        init: function(payload) {
            var scormTree = this.models.scormTree;
            var section = this.models.section;
            var attachment = this.models.attachment;

            section.set(payload);
            scormTree.set({ id: payload.attachmentId });
            attachment.set({ id: payload.attachmentId });

            return this.chain([this.get(attachment), this.get(scormTree)]);
        }
    }
};
exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.section);
};
