var strings = require('./app/util/strings'),
    D = require('drizzlejs'),
    titleType = {
        add: '新增',
        edit: '编辑'
    },
    EXAM_SOURCE_TYPE = 1,
    _ = require('lodash/collection');
exports.RESEARCH_TYPE = 2;

exports.items = {
    main: 'main'
};

exports.large = true;

exports.title = function() {
    return titleType[this.renderOptions.titleType];
};

exports.store = {
    models: {
        research: {
            url: '../exam/research-activity'
        },
        form: {
            url: '../exam/research-activity/insert-of-other-module'
        },
        img: { url: '../system/file/upload' },
        time: {}
    },
    callbacks: {
        init: function(payload) {
            var research = this.models.research;
            research.clear();
            this.models.time.clear();
            if (payload.researchId) {
                research.set({
                    id: payload.researchId,
                    sourceType: payload.sourceType || EXAM_SOURCE_TYPE
                });
                this.models.time.data = {
                    startTime: payload.startTime,
                    endTime: payload.endTime
                };
                return this.chain(this.get(research), function() {
                    research.data.name = payload.name || research.data.name;
                });
            }

            D.assign(research.data, {
                sourceType: payload.sourceType || EXAM_SOURCE_TYPE,
                type: this.module.options.RESEARCH_TYPE
            });
            return '';
        },
        save: function(payload) {
            var me = this;
            this.models.form.set(D.assign(payload, {
                sourceType: this.models.research.data.sourceType
            }));
            return this.save(this.models.form).then(function() {
                var callback = me.module.renderOptions.callback,
                    data = me.models.form.data;
                data.startTime = payload.startTime;
                data.endTime = payload.endTime;
                if (callback) callback(data);
                me.app.message.success('保存成功');
            });
        },
        changeInfo: function(payload) {
            var main = this.module.items.main.getEntities()[0],
                dateTime,
                date,
                year,
                month,
                dd,
                hour,
                min,
                times,
                result = {};
            if (payload.startTime) {
                dateTime = payload.startTime.split(' ');
                date = dateTime[0].split('-');
                times = dateTime[1].split(':');
                year = date[0];
                month = date[1];
                dd = date[2];
                hour = times[0];
                min = times[1];
                result.startTime = new Date(year, month - 1, dd, hour, min).getTime();
            }
            if (payload.endTime) {
                dateTime = payload.endTime.split(' ');
                date = dateTime[0].split('-');
                times = dateTime[1].split(':');
                year = date[0];
                month = date[1];
                dd = date[2];
                hour = times[0];
                min = times[1];
                result.endTime = new Date(year, month - 1, dd, hour, min).getTime();
            }
            D.assign(this.models.research.data, payload, main.getData());
            D.assign(this.models.time.data, result);
            this.models.research.changed();
            this.models.time.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: strings.get('ok'),
    fn: function() {
        var view = this.items.main.getEntities()[0],
            validate = this.items.main.validate(),
            dimensions = view.getData().dimensions || [],
            everyQuestionHas = dimensions.length > 0 && _.every(dimensions, function(d) { // 每个维度必须有试题
                return d.questions && d.questions.length > 0;
            });
        if (!validate) return false;
        if (!everyQuestionHas) {
            this.app.message.error('问卷内容不完整，无法保存');
            return false;
        }
        return this.dispatch('save', D.assign(
            this.items.main.getData(),
            {
                dimensions: JSON.stringify(view.getData().dimensions),
                id: this.store.models.research.data.id,
                type: this.options.RESEARCH_TYPE
            }
        ));
    }
}];
