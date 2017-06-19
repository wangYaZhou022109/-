var _ = require('lodash/collection');

exports.bindings = {
    recommendList: true,
    down: false,
    page: true
};

exports.events = {
    'click closeRecommend': 'closeRecommend',
};

exports.handlers = {
    closeRecommend: function() {
        this.module.regions.interest.close();
    }
};

exports.actions = {
    'click changeRecommend': 'changeRecommend'
};

exports.dataForActions = {
    changeRecommend: function() {
        var recordCount = this.bindings.recommendList.data.recordCount;
        var page = this.bindings.page.data.value;
        // 如果还有下一页，就把下一页加1，如果没有下一页，就把下一页重置为1
        if (page * 5 < recordCount) {
            this.bindings.page.data.value = window.parseInt(page) + 1;
        } else {
            this.bindings.page.data.value = 1;
        }
    }
};


exports.dataForTemplate = {
    recommendList: function() {
        var downUrl = this.bindings.down.getFullUrl();
        var defaultImg = 'images/default-cover/default_course.jpg';
        var defaultUrl = '#/study/course/detail/';
        var recommendList = this.bindings.recommendList.data.items;
        _.forEach(recommendList, function(obj) {
            var course = obj || {};
            if (course.businessType && course.businessType === 2) {
                defaultImg = 'images/default-cover/default_spceial.jpg';
                defaultUrl = '#/study/subject/detail/';
            }
            course.img = course.cover ? (downUrl + '?id=' + course.cover) : defaultImg;
            course.url = defaultUrl + course.id;
        });
        return recommendList;
    },
    showInterest: function() {
        var recommendList = this.bindings.recommendList.data.items;
        if (recommendList && recommendList.length > 0) {
            return true;
        }
        return false;
    }
};
