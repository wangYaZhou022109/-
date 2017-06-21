var _ = require('lodash/collection'),
    FULL_TEXT_SEARCH = 'full-text-search',
    D = require('drizzlejs');

exports.typeMaps = {
    0: 'all',
    1: 'course',
    2: 'subject',
    3: 'mooc',
    4: 'class',
    5: 'exam',
    6: 'research',
    7: 'live',
    8: 'ask-bar',
    9: 'article',
    10: 'specialist',
    11: 'topic',
    12: 'knowledge'
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
            else if (course.finishStatus === null || course.finishStatus === 0
            || course.finishStatus === 3) studyType = 0;
            course.studyType = studyType;
            course.avgScore /= 10;
            course.visits = course.visits || 0;
        });
        return data.courses;
    },
    subjects: function(data) {
        var down = this.bindings.down,
            subjects = data.subjects;
        _.map(subjects, function(opt) {
            var subject = opt;
            if (opt.cover) {
                subject.imageUrl = down.getFullUrl() + '?id=' + opt.cover;
            } else {
                subject.imageUrl = 'images/default-cover/default_spceial.jpg';
            }
            subject.studyDays = subject.studyDays || '暂无';
            return subject;
        });
        return subjects;
    },
    knowledges: function(data) {
        var defaultIcons = 'icon-zhishiku';
        var icons = ['icon-mp4', 'icon-mp3', 'icon-word', 'icon-pdf', 'icon-excel',
            'icon-ppt', 'icon-note', 'icon-zhishiku'];
        return _.map(data.knowledges, function(k) {
            var know = k || {};
            var index = know.name.lastIndexOf('.');
            var reg = /^[0-9a-zA-Z]*$/g;
            know.avgScore *= 10;
            know.icon = icons[know.type] || defaultIcons;
            if (index !== -1 && reg.test(know.name.substring(index + 1))
                && know.name.substring(index + 1).length < 5) {
                know.name = know.name.substring(0, index);
            }
            return know;
        });
    },
    lives: function(data) {
        var defultImg = 'images/default-cover/default_live.jpg',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.lives || [], function(item) {
            var gensee = item;
            gensee.cover = gensee.cover ? (downUrl + '?id=' + gensee.cover) : defultImg;
            return gensee;
        });
        return data.lives;
    },
    askBar: function(data) {
        _.map(data.askBar || [], function(item) {
            var askBar = item,
                contentTxt = askBar.contentTxt || '',
                imgs = contentTxt.match(/<img src="(.*?)".*?\/>/g) || [];
            askBar.cover = imgs[0];
            askBar.contentTxt = contentTxt.replace(/<img src="(.*?)".*?\/>/g, '');
            return askBar;
        });
        return data.askBar;
    },
    specialist: function(data) {
        var defultImg = 'images/default-userpic.png',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.specialist || [], function(item) {
            var specialist = item;
            specialist.cover = specialist.member.headPortrait ?
            (downUrl + '?id=' + specialist.member.headPortrait) : defultImg;
            return specialist;
        });
        return data.specialist;
    },
    topics: function(data) {
        var defultImg = 'images/default-cover/default_topic.jpg',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.topics || [], function(item) {
            var topic = item;
            topic.cover = topic.attachmentId ? (downUrl + '?id=' + topic.attachmentId) : defultImg;
            return topic;
        });
        return data.topics;
    }
};

// 获取搜索历史
exports.getSearchHistory = function() {
    var searchHistoryStr = localStorage.getItem(FULL_TEXT_SEARCH);
    return searchHistoryStr ? JSON.parse(searchHistoryStr) : [];
};

exports.addSearchHistory = function(option) {
    var searchHistorys = this.getSearchHistory();
    searchHistorys.push(option);
    localStorage.setItem(FULL_TEXT_SEARCH, JSON.stringify(searchHistorys));
};

exports.editSearchHistory = function(option) {
    var searchHistorys = this.getSearchHistory(),
        param = option;
    if (_.find(searchHistorys, { id: option.id })) {
        _.map(searchHistorys, function(his) {
            var history = his;
            if (history.id === option.id) {
                history.time = new Date().getTime();
                D.assign(param, history);
            }
            return history;
        });
        localStorage.setItem(FULL_TEXT_SEARCH, JSON.stringify(searchHistorys));
    } else {
        this.addSearchHistory(param);
    }
    return param;
};

exports.removeSearchHistory = function(option) {
    var searchHistorys = this.getSearchHistory(),
        arr = _.filter(searchHistorys, function(history) {
            return history.id !== option.id;
        });
    localStorage.setItem(FULL_TEXT_SEARCH, JSON.stringify(arr));
};

exports.clearSearchHistory = function() {
    localStorage.removeItem(FULL_TEXT_SEARCH);
};
