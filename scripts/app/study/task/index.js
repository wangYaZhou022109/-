var changeToFullScreen,
    $ = require('jquery'),
    D = require('drizzlejs');
exports.items = {
    side: 'side',
    main: 'main',
    head: 'head',
    edit: '',
    upload: ''
};

exports.store = {
    models: {
        state: {},
        task: {},
        section: { url: '../course-study/course-front/section' },
        progress: { url: '../course-study/course-front/submit-progress' },
        startStudy: { url: '../course-study/course-front/start-study' },
        preview: { url: '../human/file/preview' },
        download: { url: '../human/file/download' },
        file: { url: '../human/file/upload-parse-file' },
        img: { url: '../system/file/upload' }
    },
    callbacks: {
        init: function(options) {
            var taskModel = this.models.task,
                sectionModel = this.models.section,
                progressModel = this.models.progress,
                startStudyModel = this.models.startStudy;
            sectionModel.set({ id: options.id });
            startStudyModel.set({ sectionId: options.id, clientType: 0 });
            this.save(startStudyModel);
            this.get(sectionModel).then(function(data) {
                if (data[0]) {
                    taskModel.set(data[0].studyTask);
                    progressModel.set(data[0].progress);
                    taskModel.changed();
                }
            });
        },
        preview: function(payload) {
            var state = this.models.state;
            D.assign(state.data || {}, payload);
            state.changed();
        },
        addFile: function(payload) {
            var me = this,
                attachments = payload;
            me.models.progress.data.sectionAttachments = attachments;
            me.models.progress.changed();
        },
        submitTask: function(payload) {
            var progressModel = this.models.progress,
                section = this.models.section.data,
                attachment = progressModel.data.sectionAttachments[0] || {},
                params = payload,
                me = this,
                attachments = [D.assign(attachment, payload)],
                progress = section.progress;
            params.sectionId = section.referenceId;
            params.clientType = 0;
            if (attachments && attachments.length > 0) {
                params.attachments = JSON.stringify(attachments);
            }
            progressModel.set(params);
            return this.save(progressModel).then(function() {
                me.app.message.success('提交成功!');
                progress.finishStatus = 5;
                me.models.section.data.progress = progress;
                me.models.section.changed();
            });
        }

    }
};

exports.beforeRender = function() {
    changeToFullScreen();
    return this.dispatch('init', this.renderOptions);
};

changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
