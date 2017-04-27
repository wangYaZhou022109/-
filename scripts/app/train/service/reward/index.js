
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
    },
    callbacks: {
        courseSalaryList: function(options) { // 课酬管理
            var courseSalary = this.models.courseSalary;
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
            console.log(payload);
            updateClass.set(payload);
            return this.save(updateClass);
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('courseSalaryList', { classId: this.renderOptions.state.classId });
};
