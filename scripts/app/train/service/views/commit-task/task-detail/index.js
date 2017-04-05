var D = require('drizzlejs');

exports.items = {
    head: 'head',
    main: 'main',
    side: 'side',
    edit: '',
    upload: ''
};

exports.store = {
    models: {
        state: {},
        taskMemberModel: { data: {} },
        mainState: { data: { isExplain: true } },
        task: { url: '../train/task' },
        taskMember: { url: '../train/aaaaa' },
        preview: { url: '../human/file/preview' },
        download: { url: '../human/file/download' },
        file: { url: '../human/file/upload-parse-file' }
    },
    callbacks: {
        init: function(payload) {
            var task = this.models.task;
            task.set({ id: payload });
            return this.get(task);
        },
        preview: function(payload) {
            var state = this.models.state;
            D.assign(state.data || {}, payload);
            state.changed();
        },
        uploadTaskMember: function(payload) {
            var taskMember = this.models.taskMember;
            taskMember.clear();
            taskMember.params = payload;
            taskMember.data = payload;
            taskMember.changed();
        },
        submitTask: function(payload) {
            var taskMember = this.models.taskMember,
                task = this.models.task,
                params = taskMember.params;
            params.name = payload.name;
            params.description = payload.description;
            params.taskId = task.data.id;
            params.state = 2;
            console.log(taskMember);
            return this.save(taskMember);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.id);
};
