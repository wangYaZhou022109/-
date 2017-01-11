var D = require('drizzlejs');

exports.items = {
    video: 'video'
};

exports.store = {
    models: {
        // 音视频更新进度
        updateProgress: { url: '../course-study/course-front/progress' },
        download: { url: '../human/file/download' },
        time: { url: '../system/setting/time' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                time = this.models.time;
            state.set(payload);
            return this.get(time);
        },
        time: function() {
            var time = this.models.time;
            return this.get(time);
        },
        updateProgress: function(payload) {
            var section = this.models.state.data.section,
                model = this.models.updateProgress,
                params = {
                    sectionId: section.id,
                    clientType: 0,
                };
            D.assign(params, payload);
            model.set(params);
            return this.post(model);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
