
exports.items = {
    content: 'content',
    edit: ''
};

exports.store = {
    models: {
        courseSalary: {
            url: '../train/courseSalary',
        },
        downloadexternal: { url: '../train/courseSalary/downloadexternal' },
        edit: {
            url: '../train/courseSalary/get'
        },
        updateClass: {
            url: '../train/courseSalary'
        },
        state: {
            data: {}
        }
    },
    callbacks: {
        courseSalaryList: function(options) { // 课酬管理
            var courseSalary = this.models.courseSalary;
            this.models.state.data.classId = options.classId;
            courseSalary.params = { id: options.classId };
            return this.get(courseSalary);
        },
        edit: function(id) { // 课酬管理详情
            var edit = this.models.edit;
            edit.clear();
            edit.params = id;
            return this.get(edit);
        },
        updateClass: function(payload) {
            var updateClass = this.models.updateClass;
            var courseSalary = this.models.courseSalary;
            updateClass.set(payload);
            return this.put(updateClass).then(function() {
                this.get(courseSalary);
            });
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('courseSalaryList', { classId: this.renderOptions.state.classId });
};
