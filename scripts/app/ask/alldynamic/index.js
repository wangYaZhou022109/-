var _ = require('lodash/collection');
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        course: {
            url: '../course-study/course-front',
            mixin: {
                findChapter: function(chapterId) {
                    return _.find(this.data.courseChapters, { id: chapterId });
                },
                findSection: function(sectionId) {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.find(_.flatMap(this.data.courseChapters, duplicate), { id: sectionId });
                },
                findSectionForReferId: function(referenceId) {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.find(_.flatMap(this.data.courseChapters, duplicate), { referenceId: referenceId });
                },
                findSectionsForType: function(type) {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.filter(_.flatMap(this.data.courseChapters, duplicate), { sectionType: type });
                },
                findFirstSection: function() {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.flatMap(this.data.courseChapters, duplicate)[0];
                }
            }
        },
        trends: { url: '../ask-bar/trends/all-dynamic' },
        discuss: { url: '../ask-bar/question-discuss' },
        reply: { url: '../ask-bar/question-reply' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        del: { url: '../ask-bar/trends/del' }
    },
    callbacks: {
        init: function() {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
            return this.get(trends);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            // console.log(payload);
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            // console.log(payload);
            follow.set(payload);
            return this.put(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        },
        reply: function(payload) {
            var discuss = this.models.reply;
            discuss.set(payload);
            return this.save(discuss);
        },
        delquestion: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        },
        delshare: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        },
        deldiscuss: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
