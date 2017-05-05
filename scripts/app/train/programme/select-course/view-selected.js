var _ = require('lodash/collection');

exports.bindings = {
    targetList: true,
    state: false,
    courseList: true,
    themeList: true,
    delList: false,
    selectedList: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'courseList' }
}];

exports.events = {
    'click move-up-*': 'moveUp',
    'click move-down-*': 'moveDown',
    'click course-*': 'selected',
    'change selectTheme': 'changeTheme',
    'click submitOffline': 'save'
};

exports.handlers = {
    moveUp: function(id) {
        var targetList = this.bindings.targetList.data,
            target,
            index,
            sort;
        index = targetList.findIndex(function(e) {
            return e.id === id;
        });
        if (index <= 0) {
            return;
        }
        target = targetList[index];
        sort = targetList[index - 1].sort;
        targetList[index] = targetList[index - 1];
        targetList[index].sort = target.sort;
        targetList[index - 1] = target;
        targetList[index - 1].sort = sort;
        this.bindings.targetList.changed();
    },
    moveDown: function(id) {
        var targetList = this.bindings.targetList.data,
            target,
            index,
            sort;
        index = targetList.findIndex(function(e) {
            return e.id === id;
        });
        if (index >= targetList.length - 1) {
            return;
        }
        target = targetList[index];
        sort = targetList[index + 1].sort;
        targetList[index] = targetList[index + 1];
        targetList[index].sort = target.sort;
        targetList[index + 1] = target;
        targetList[index + 1].sort = sort;
        this.bindings.targetList.changed();
    },
    selected: function(id) {
        var courseList = this.bindings.courseList.data,
            targetList = this.bindings.targetList.data,
            state = this.bindings.state.data,
            delList = this.bindings.delList.data,
            selectedList = this.bindings.selectedList.data,
            newCourse,
            index;
        var isChecked = this.$('course-' + id).checked;
        var themeId = this.$('selectTheme').value;
        if (isChecked) {
            index = selectedList.findIndex(function(e) {
                return e.resourceId === id;
            });
            if (index > -1 && selectedList[index].themeId !== themeId) {
                this.app.message.alert('不能重复添加该课程');
                this.$('course-' + id).checked = false;
                return;
            }
            newCourse = {};
            state.index++;
            newCourse.id = id;
            newCourse.classId = state.classId;
            newCourse.type = 1;
            newCourse.resourceId = id;
            index = courseList.findIndex(function(e) {
                return e.id === id;
            });
            newCourse.resourceName = courseList[index].name;
            newCourse.themeId = themeId;
            newCourse.sort = state.index;
            newCourse.isRequired = 1;
            targetList.push(newCourse);
        } else {
            index = targetList.findIndex(function(e) {
                return e.resourceId === id;
            });
            delList.push(targetList[index]);
            targetList.splice(index, 1);
        }
        this.bindings.targetList.changed();
    },
    changeTheme: function() {
        var selectedList = this.bindings.selectedList,
            targetList = this.bindings.targetList.data,
            state = this.bindings.state.data;
        var themeId = this.$('selectTheme').value;
        state.themeId = themeId;
        targetList = [];
        _.map(selectedList.data || [], function(course) {
            var r = course;
            if (r.themeId === themeId) {
                targetList.push(r);
            }
        });
        this.bindings.targetList.data = targetList;
        this.bindings.targetList.changed();
    },
    save: function() {
        var targetList = this.bindings.targetList.data,
            delList = this.bindings.delList.data;
        var themeId = this.$('selectTheme').value;
        this.module.renderOptions.callback(themeId, targetList, delList);
        this.app.viewport.closeModal();
    }
};

exports.dataForTemplate = {
    targetList: function() {
        var targetList = this.bindings.targetList.data;
        return targetList;
    },
    search: function() {
        var courseList = this.bindings.courseList;
        return courseList.params;
    },
    courseList: function() {
        var courseList = this.bindings.courseList,
            targetList = this.bindings.targetList.data,
            index;
        _.map(courseList.data || [], function(course) {
            var r = course;
            index = targetList.findIndex(function(e) {
                return e.resourceId === r.id;
            });
            if (index > -1) {
                r.checked = true;
            } else {
                r.checked = false;
            }
        });
        return courseList.data;
    },
    themeList: function() {
        var themeList = this.bindings.themeList,
            state = this.bindings.state.data;
        _.map(themeList.data || [], function(theme) {
            var r = theme;
            if (r.id === state.themeId) {
                r.selected = true;
            } else {
                r.selected = false;
            }
        });
        return themeList.data;
    }
};

exports.actions = {
    'click btnSearch': 'doSearch'
};

exports.dataForActions = {
    doSearch: function() {
        return {
            name: this.$('name').value,
            // categoryId: this.$('categoryId').value,
            // categoryName: this.$('categoryName').value,
            // organizationId: this.$('organizationId').value,
            // organizationName: this.$('organizationName').value
        };
    }
};

exports.actionCallbacks = {

};
