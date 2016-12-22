exports.items = {
    content: 'content'
};

exports.store = {
    models: {
        section: {},
        sectionProgress: {},
        download: {
            url: '../human/file/download'
        }
    },
    callbacks: {
        init: function(options) {
            this.models.section.set(options.section);
            this.models.sectionProgress.set(options.sectionProgress);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    getData: function() {
        var progress = this.store.models.courseSectionStudyProgress.data,
            pdfView = this.items.content.components.viewPdf.getData();
        progress.lessonLocation = pdfView.pageNum;
        return progress;
    }
};
