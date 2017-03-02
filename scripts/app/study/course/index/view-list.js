var _ = require('lodash/collection');
exports.bindings = {
    state: true,
    courses: true,
    down: false,
    search: 'changeSearch',
    topics: true
};

exports.events = {
    'click sort-*': 'sort',
    'click three-item*': 'selectThree',
    'click four-item*': 'selectFour',
    'click topic-*': 'selectTopic'
};

exports.handlers = {
    selectThree: function(id) {
        return this.chain([
            this.module.dispatch('search', { categoryId: id }),
            this.module.dispatch('selectMenu3', { id: id })
        ]);
    },
    selectFour: function(id) {
        return this.module.dispatch('search', { categoryId: id });
    },
    sort: function(id) {
        var searchDate = this.bindings.search.data;
        var orderMap = { 1: 2, 2: 1 };
        // 如果相同 改变排序升降, 不同,默认降序
        var data = (searchDate.orderBy === id) ? { order: orderMap[searchDate.order] } : { order: 2, orderBy: id };
        return this.module.dispatch('search', data);
    },
    selectTopic: function(id) {
        this.module.dispatch('search', { topicId: id });
    }
};


exports.dataForTemplate = {
    courses: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        var defultImg = 'images/default-cover/default_course.jpg';
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
    },
    topics: function(data) {
        var selectId = data.search.topicId;
        var list = data.topics;
        return _.map(list, function(m) {
            var obj = m || {};
            delete obj.active;
            if (selectId === obj.id) obj.active = true;
            return obj;
        });
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'courses' }
}];

exports.changeSearch = function() {
    var params = this.bindings.search.data;
    params.categoryId = params.menu2 || params.menu1;
    this.module.dispatch('searchCourse', { params: params });
};
