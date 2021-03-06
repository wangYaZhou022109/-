var _ = require('lodash/collection');

exports.items = {
    selected: 'selected',
    'train/programme/course-category': { isModule: true },
    'train/statistics/navigate-tree': { isModule: true, uri: 'human/member' }
};

exports.title = '添加课程';

exports.large = true;

exports.store = {
    models: {
        themeList: { url: '../train/theme' },
        selectedList: { url: '../train/online-course' },
        courseList: { url: '../course-study/course-info/select-for-train', type: 'pageable', root: 'items' },
        state: { data: {} },
        targetList: { data: [] },
        delList: { data: [] }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state.data,
                courseList = this.models.courseList,
                themeList = this.models.themeList,
                selectedList = this.models.selectedList,
                targetList = this.models.targetList.data,
                themeId,
                me = this;
            state.classId = payload.classId;
            themeList.params.classId = payload.classId;
            themeList.params.type = 2;
            courseList.params = {};
            this.get(courseList);
            // this.models.targetList.clear();
            this.get(themeList).then(function(data) {
                selectedList.params.classId = state.classId;
                me.models.targetList.data = [];
                targetList = [];
                me.get(selectedList).then(function(list) {
                    state.index = data[0].length;
                    // console.log(data[0]);// 主题集合
                    if (data[0].length > 0) {
                        themeId = data[0][0].id;
                        state.themeId = themeId;
                        // console.log(themeId);// 主题的id
                        _.map(list[0] || [], function(course) {
                            var r = course;
                            if (r.themeId === themeId) {
                                targetList.push(r);
                            }
                        });
                    } else {
                        targetList = list[0];
                    }
                    me.models.targetList.data = targetList;
                    me.models.targetList.changed();
                });
            });
        },
        doSearch: function(options) {
            var model = this.models.courseList;
            model.clear();
            model.params = options;
            this.get(model);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.id });
};

exports.buttons = [{
    text: '保存',
    fn: function() {
        var targetList = this.store.models.targetList.data,
            delList = this.store.models.delList.data,
            state = this.store.models.state.data;
        var themeId = state.themeId;
        this.renderOptions.callback(themeId, targetList, delList);
    }
}];
