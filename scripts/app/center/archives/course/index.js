exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        progressList: { url: '../course-study/course-study-progress/person-list', type: 'pageable', root: 'items' },
        progress: { url: '../course-study/course-study-progress/export-person-list' },
        businessType: { value: '0' }
    },
    callbacks: {
        init: function(options) {
            var me = this,
                businessType = me.models.businessType,
                progressList = me.models.progressList;
            progressList.clear();
            businessType.value = options.businessType;
            progressList.params = options;
            me.get(progressList);
        },
        refreshList: function() {
            var model = this.models.details;
            this.get(model);
        }
    }
};


exports.beforeRender = function() {
    var menuId = this.renderOptions.state.menuId,
        businessType = '0';
    if (menuId === '1') { // 专题
        businessType = '2';
    }
    // 注意菜单id和数据类型typ不一样，courseType: 0-课程；1-学习路径；2-专题',
    this.dispatch('init', { businessType: businessType });
};
