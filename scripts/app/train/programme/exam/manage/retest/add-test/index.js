var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    createAudienceItems;

exports.title = '安排补考';

exports.large = true;

exports.items = {
    step: 'step',
    main: 'main'
};

exports.store = {
    models: {
        state: {},
        exam: {},
        retest: { url: '../exam/exam' },
        form: { url: '../exam/exam/retest' }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            if (payload.exam) {
                this.models.exam.set(payload.exam);
            }
            state.data = {
                step: 1,
                maxStep: 2,
                num: payload.num || 1,
                latestExamId: payload.latestExamId
            };

            if (payload.id) {
                this.models.retest.set({ id: payload.id });
                return this.get(this.models.retest);
            }

            this.models.retest.set({
                name: '(' + payload.exam.name + ')补考' + payload.num,
                parentId: payload.exam.id,
                duration: payload.exam.duration
            });
            return '';
        },
        toStep: function(data) {
            var step = data.step,
                payload = data.payload,
                state = this.models.state,
                retest = this.models.retest;
            D.assign(retest.data, payload);
            D.assign(state.data, { step: step });
            state.changed();
        },
        saveRetest: function(data) {
            var me = this,
                payload = data.payload,
                retest = this.models.retest,
                form = this.models.form;
            D.assign(form.data, retest.data, payload, {
                audienceItems: createAudienceItems(retest.data.members)
            });
            return this.save(this.models.form).then(function() {
                me.app.message.success('保存成功');
                me.models.form.clear();
                me.models.retest.clear();
                return me.module.renderOptions.callback();
            });
        },
        getRetest: function(payload) {
            this.models.retest.set(payload);
            return this.get(this.models.retest);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.afterRender = function() {
    if (this.renderOptions.id) {
        return this.dispatch('getRetest', { id: this.renderOptions.id });
    }
    return false;
};

exports.buttons = function() {
    var step = this.store.models.state.data.step || 1;
    var maxStep = 2;
    var btns = [];
    var nextBtn = {
        text: '下一步',
        fn: function(payload) {
            var view = this.items.main.getEntities()[0];
            if (view.isValidator && !view.isValidator()) return false;
            this.dispatch('toStep', {
                step: step + 1,
                payload: D.assign(payload, view.getValue())
            });
            return false;
        }
    };
    var preBtn = {
        text: '上一步',
        fn: function(payload) {
            var view = this.items.main.getEntities()[0];
            this.dispatch('toStep', {
                step: step - 1,
                payload: D.assign(payload, view.getValue())
            });
            return false;
        }
    };
    var saveBtn = {
        text: '保存',
        fn: function(payload) {
            var view = this.items.main.getEntities()[0];
            if (view.isValidate && !view.isValidate()) return false;
            return this.dispatch('saveRetest', {
                payload: D.assign(payload, view.getValue())
            });
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
    }
    return btns;
};

createAudienceItems = function(members) {
    return JSON.stringify(_.map(members, function(m) {
        return {
            text: m.text,
            value: m.value,
            type: 5
        };
    }));
};

