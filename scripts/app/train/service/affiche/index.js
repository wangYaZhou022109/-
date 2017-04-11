exports.items = {
    content: 'content',
};

exports.store = {
    models: {
        detail: {
            url: '../train/class-detail/find'
        },
        save: {
            url: '../train/class-detail'
        },
        state: {
            data: {}
        }
    },
    callbacks: {
        init: function(options) { // 班级公告
            var detail = this.models.detail;
            detail.params = { id: options.classId };
            this.models.state.data.classId = options.classId;
            return this.get(detail);
        },
        saveBulletin: function(data) {
            var detail = this.models.save,
                detailData = data,
                me = this;
            detailData.classId = this.models.state.data.classId;
            detail.set(detailData);
            return me.save(detail);
            // .then(function() {
            //     return me.get(detail);
            // });
        }
    }
};
exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
