var D = require('drizzlejs'),
    getCourses,
    getSubjects,
    getExams,
    getResearchs,
    getLives,
    getKnowledges,
    getAskBar,
    getArticles,
    getSpecialist,
    getTopics;

exports.items = {
    main: 'main',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        courses: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 5,
            root: 'items'
        },
        subjects: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 5,
            root: 'items'
        },
        mooc: { url: '' },
        classes: { url: '' },
        exams: {
            url: '../exam/exam/activity-list',
            type: 'pageable',
            pageSize: 6,
            root: 'items'
        },
        researchs: {
            url: '../exam/research-activity/activity-list',
            type: 'pageable',
            pageSize: 6,
            root: 'items'
        },
        lives: {
            url: '../course-study/gensee/activity-list',
            type: 'pageable',
            pageSize: 5,
            root: 'items'
        },
        askBar: {
            url: '../ask-bar/question/queryQuestion',
            type: 'pageable',
            pageSize: 3,
            root: 'items'
        },
        articles: {
            url: '../ask-bar/question/queryArticle',
            type: 'pageable',
            pageSize: 3,
            root: 'items'
        },
        specialist: {
            url: '../ask-bar/expert/queryExpert',
            type: 'pageable',
            pageSize: 3,
            root: 'items'
        },
        topics: {
            url: '../ask-bar/topic/queryTopic',
            type: 'pageable',
            pageSize: 8,
            root: 'items'
        },
        knowledges: {
            url: '../course-study/knowledge/front',
            type: 'pageable',
            pageSize: 4,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        register: { url: '../course-study/course-front/register' },
        state: {
            data: {},
            mixin: {
                countData: function(recordCount) {
                    var count = this.data.count || 0;
                    this.data.count = count + recordCount;
                    this.changed();
                }
            }
        }
    },
    callbacks: {
        init: function(options) {
            this.models.state.clear();
            this.models.state.set(D.assign({}, options.state));
            this.chain([
                getCourses.call(this, options.state),
                getSubjects.call(this, options.state),
                getExams.call(this, options.state),
                getResearchs.call(this, options.state),
                getLives.call(this, options.state),
                getKnowledges.call(this, options.state),
                getAskBar.call(this, options.state),
                getArticles.call(this, options.state),
                getSpecialist.call(this, options.state),
                getTopics.call(this, options.state)
            ], true);
        },
        register: function(payload) {
            var register = this.models.register,
                me = this;
            register.set({ courseId: payload.id });
            return me.post(register);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

getCourses = function(option) {
    var courses = this.models.courses,
        state = this.models.state;
    courses.params = {
        type: 0,
        publishClient: 1,
        searchContent: option.searchContent,
        topicId: option.topicId
    };
    return this.get(courses).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getSubjects = function(option) {
    var subjects = this.models.subjects,
        state = this.models.state;
    subjects.params = {
        type: 2,
        publishClient: 1,
        searchContent: option.searchContent,
        topicId: option.topicId
    };
    return this.get(subjects).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getExams = function(option) {
    var exams = this.models.exams,
        state = this.models.state;
    exams.params = {
        clientType: 1,
        name: option.searchContent,
        topicId: option.topicId
    };
    return this.get(exams).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getResearchs = function(option) {
    var researchs = this.models.researchs,
        state = this.models.state;
    researchs.params = {
        name: option.searchContent,
        topicId: option.topicId
    };
    return this.get(researchs).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getLives = function(option) {
    var lives = this.models.lives,
        state = this.models.state;
    lives.params = {
        clientType: 1,
        subject: option.searchContent,
        topicId: option.topicId
    };
    return this.get(lives).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getKnowledges = function(option) {
    var knowledges = this.models.knowledges,
        state = this.models.state;
    knowledges.params = {
        clientType: 1,
        orderType: 0,
        name: option.searchContent,
        topicId: option.topicId
    };
    return this.get(knowledges).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getAskBar = function(option) {
    var askBar = this.models.askBar,
        state = this.models.state;
    askBar.params = { name: option.searchContent, topicId: option.topicId };
    return this.get(askBar).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getArticles = function(option) {
    var articles = this.models.articles,
        state = this.models.state;
    articles.params = { name: option.searchContent, topicId: option.topicId };
    return this.get(articles).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};
getSpecialist = function(option) {
    var specialist = this.models.specialist,
        state = this.models.state;
    specialist.params = { name: option.searchContent, topicId: option.topicId };
    return this.get(specialist).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};

getTopics = function(option) {
    var topics = this.models.topics,
        state = this.models.state;
    topics.params = { name: option.searchContent, topicId: option.topicId };
    return this.get(topics).then(function(data) {
        state.countData(data[0].recordCount);
        return data;
    });
};
