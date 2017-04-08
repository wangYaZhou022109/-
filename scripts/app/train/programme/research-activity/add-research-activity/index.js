var D = require('drizzlejs'),
    strings = require('./app/util/strings'),
    RESEARCH_ACTIVITY = 1,
    _ = require('lodash/collection'),
    getJsonTopic,
    PUBLISH = 2;

exports.title = '新增调研活动';

exports.items = {
    step: 'step',
    main: 'main'
};

exports.store = {
    models: {
        research: { type: 'localStorage', url: '../exam/research-activity' },
        researchForm: { url: '../exam/research-activity' },
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state,
                research = this.models.research,
                me = this;

            research.data = this.module.renderOptions || {};
            state.data.step = 1;

            if (research.data.id) {
                return this.get(research).then(function() {
                    D.assign(me.models.researchForm.data, research.data);
                    state.changed();
                });
            }

            this.models.research.load();
            state.changed();
            return '';
        },
        toStep: function(data) {
            var step = data.step,
                payload = data.payload,
                viewData = data.data,
                state = this.models.state,
                research = this.models.research;
            research.data = D.assign(research.data || {}, viewData, payload);
            if (!research.data.id) {
                research.save();
            }

            if (step) state.data.step = step;

            state.changed();
            return true;
        },
        saveResearch: function() {
            var research = this.models.research,
                researchForm = this.models.researchForm,
                state = this.models.state;
            D.assign(researchForm.data, research.data, {
                audienceItems: JSON.stringify(research.data.audienceItems),
                dimensions: JSON.stringify(research.data.dimensions),
                isPublish: state.data.isPublish || 1,
                type: RESEARCH_ACTIVITY,
                topics: getJsonTopic(research.data.topic)
            });
            return this.save(researchForm).then(function() {
                research.clear();
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};

exports.buttons = function() {
    var step = this.store.models.state.data.step || 1,
        maxStep = 3,
        btns = [],
        nextBtn = {
            text: strings.get('next-step'),
            fn: function(payload) {
                var view = this.items.main.getEntities()[0];
                if (view && view.isValidator && !view.isValidator()) {
                    return false;
                }
                this.dispatch('toStep', {
                    step: step + 1,
                    payload: payload,
                    data: view && view.getData && view.getData()
                });
                return false;
            }
        },
        preBtn = {
            text: strings.get('pre-step'),
            fn: function(payload) {
                var view = this.items.main.getEntities()[0];
                this.dispatch('toStep', {
                    step: step - 1,
                    payload: payload,
                    data: view && view.getData && view.getData()
                });
                return false;
            }
        },
        saveBtn = {
            text: strings.get('save'),
            fn: function(payload) {
                var view = this.items.main.getEntities()[0],
                    me = this,
                    callback = this.renderOptions.callback;

                if (view.isValidator && !view.isValidator()) {
                    return false;
                }

                return this.chain(this.dispatch('toStep', {
                    payload: payload,
                    data: view.getData && view.getData()
                }), this.dispatch('saveResearch').then(function(data) {
                    me.app.message.success('保存成功');
                    callback && callback(data);
                }));
            }
        },
        saveAndPublish = {
            text: strings.get('publish'),
            fn: function(payload) {
                var view = this.items.main.getEntities()[0],
                    me = this,
                    callback = this.renderOptions.callback,
                    message = '确定要发布该数据吗?';

                if (view.isValidator && !view.isValidator()) {
                    return false;
                }

                this.app.message.confirm(message, function() {
                    me.store.models.state.data.isPublish = PUBLISH;
                    return me.chain(me.dispatch('toStep', {
                        payload: payload,
                        data: view.getData && view.getData()
                    }), me.dispatch('saveResearch').then(function(data) {
                        me.app.message.success('保存成功');
                        callback && callback(data);
                        me.app.viewport.closeGround();
                    }));
                }, function() {
                    return false;
                });
                return false;
            }
        };

    if (step === 1) {
        btns.push(nextBtn);
    } else if (step < maxStep) {
        btns.push(preBtn);
        btns.push(nextBtn);
    } else {
        btns.push(preBtn);
        btns.push(saveBtn);
        btns.push(saveAndPublish);
    }

    return btns;
};

getJsonTopic = function(topics) {
    return JSON.stringify(_.map(topics, function(t) {
        return {
            topicId: t.value
        };
    }));
};
