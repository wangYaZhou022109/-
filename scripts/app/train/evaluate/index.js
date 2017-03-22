var D = require('drizzlejs');
exports.items = {
    main: 'main',
    upload: '',
};

exports.store = {
    models: {
        Evaluate: { url: '../train/evaluate' },
        download: { url: '../human/file/download' },
        file: { url: '../human/file/upload-parse-file' },
        files: { data: [] },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var Evaluate = this.models.Evaluate,
                files = this.models.files,
                state = this.models.state;
            Evaluate.params.id = payload.id.classId;
            state.data.classId = payload.id.classId;
            files.clear();
            this.get(Evaluate).then(function(data) {
                var d = data,
                    newFile = {};
                newFile.id = d[0].id;
                newFile.attachId = d[0].attachmentId;
                newFile.attachName = d[0].attachmentName;
                files.data.push(newFile);
                files.changed();
            });
            return this.get(Evaluate);
        },
        submit: function(payload) {
            var Evaluate = this.models.Evaluate,
                data = { attachmentId: this.models.files.data[0].attachId,
                    attachmentName: this.models.files.data[0].attachName },
                pay = payload;
            pay.id = this.models.state.data.classId;
            D.assign(pay, data);
            Evaluate.set(pay);
            return this.save(Evaluate);
        },
        uploadFile: function(payload) {
            var files = this.models.files.data || [],
                data = payload[0],
                newFile = {};
            newFile.attachId = data.attachmentId;
            newFile.attachName = data.name;
            files.push(newFile);
            this.models.files.changed();
        },
        delAttach: function(payload) {
            var files = this.models.files.data,
                state = this.models.state.data,
                courseAttach = this.models.courseAttach,
                index;
            index = files.findIndex(function(e) {
                return e.id === payload.id;
            });
            files.splice(index, 1);
            this.models.files.changed();
            if (state.delType) {
                courseAttach.set(payload);
                this.del(courseAttach);
            }
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state });
};
