exports.bindings = {
    state: true,
    courses: true,
    down: false,
    search: true,
};

exports.events = {
    'click sort-*': 'sort'
};

exports.handlers = {
    sort: function(id) {
        var searchDate = this.bindings.search.data;
        var orderMap = { 1: 2, 2: 1 };
        // 如果相同 改变排序升降, 不同,默认降序
        var data = (searchDate.orderBy === id) ? { order: orderMap[searchDate.order] } : { order: 2, orderBy: id };
        return this.module.dispatch('search', data);
    }
};


exports.dataForTemplate = {
    courses: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        var defultImg = 'http://img.ui.cn/data/file/9/1/3/868319.jpg';
        data.courses.forEach(function(obj) {
            var course = obj || {};
            var studyType = 1; // 继续学习
            course.img = course.cover ? (downUrl + '?id=' + course.cover) : defultImg;
            if (course.description) {
                course.description = course.description.replace(/<[^>]+>/g, '').substr(0, 20);
            }
            if (course.finishStatus === 2 || course.finishStatus === 4) studyType = 2;
            else if (course.finishStatus === null) studyType = 0;
            course.studyType = studyType;
        });
        return data.courses;
    },
    sortStatus: function(data) {
        return {
            shelve_asc: data.search.orderBy === '0' && data.search.order === 1,
            shelve_desc: data.search.orderBy === '0' && data.search.order === 2,
            member_asc: data.search.orderBy === '1' && data.search.order === 1,
            member_desc: data.search.orderBy === '1' && data.search.order === 2
        };
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'courses' }
}];
