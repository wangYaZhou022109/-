var D = require('drizzlejs');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        subjects: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 20,
            root: 'items'
        },
        search: {
            data: {
                orderBy: '0',
                order: 2,
                top: 'top'
            }
        },
        download: {
            url: '../human/file/download'
        },
        topics: { data: [], url: '../system/topic/hot' },
        register: { url: '../course-study/course-front/register' }
    },
    callbacks: {
        init: function() {
            var subjects = this.models.subjects,
                topics = this.models.topics;
            subjects.params.type = 2; // 资源类型为专题
            topics.params = { limit: 8, type: 7 }; // 热门标签
            return this.chain(this.get(subjects), this.get(topics));
        },
        order: function(payload) {
            var search = this.models.search.data,
                order = 1;
            if (search.orderBy !== payload.orderBy) {
                order = 2;
            } else if (search.order === 1) {
                order = 2;
            }
            this.models.subjects.params.order = order;
            this.models.subjects.params.orderBy = payload.orderBy;
            this.models.search.set(D.assign(search, this.models.subjects.params));
            this.models.search.changed();
            return this.get(this.models.subjects);
        },
        search: function(payload) {
            var search = this.models.search;
            D.assign(search.data, payload);
            D.assign(this.models.subjects.params, payload);
            this.models.search.changed();
            return this.get(this.models.subjects);
        },
        register: function(payload) {
            var register = this.models.register,
                me = this;
            register.set({
                courseId: payload.id
            });
            return me.post(register);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
