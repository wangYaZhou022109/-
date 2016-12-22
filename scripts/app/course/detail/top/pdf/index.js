exports.items = {
    content: 'content'
};

exports.store = {
    models: {
        courseChapterSection: {},
        courseSectionStudyProgress: {},
        download: {
            url: '../human/file/download'
        }
    },
    callbacks: {
        init: function(options) {
            this.models.courseChapterSection.set(options.courseChapterSection);
            this.models.courseSectionStudyProgress.set(options.courseSectionStudyProgress);
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
