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
        state: { data: { id: 3 } }
    },
    callbacks: {
        init: function(payload) {
            var Evaluate = this.models.Evaluate,
                files = this.models.files;
            Evaluate.params = payload;
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
            var Evaluate = this.models.Evaluate;
            var data = { attachmentId: this.models.files.data[0].attachId,
                attachmentName: this.models.files.data[0].attachName };
            var pay = payload;
            pay.id = payload.id[0];
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
    var id = this.store.models.state.data;
    return this.dispatch('init', id);
};
