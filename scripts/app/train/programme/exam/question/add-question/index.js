var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    getData,
    titles = { add: '新增试题', edit: '修改试题' },
    covert;

exports.items = {
    'item-pool': 'item-pool',
    main: 'main',
    question: 'question',
    preview: ''
};

exports.title = function() {
    if (this.renderOptions.titleType) return titles[this.renderOptions.titleType];
    return titles.add;
};

exports.large = true;

exports.store = {
    models: {
        question: { url: '../exam/question' },
        state: { data: {} },
        itemPool: { data: {} },
        tempAddQuestionOptions: {},
        key: {}
    },
    callbacks: {
        init: function(payload) {
            var question = payload.question,
                state = this.models.state,
                itemPool = this.models.itemPool,
                tempAddQuestionOptions = this.models.tempAddQuestionOptions,
                interim = payload.interim || false;

            tempAddQuestionOptions.set(payload);

            state.clear();
            state.data.type = 1;

            this.models.question.set(question);
            if (question) this.models.key.set({ id: question.id });

            D.assign(state.data, question);
            D.assign(state.params, payload.params || {});

            itemPool.data.interim = interim;
            if (interim) {
                if (question && (question.questionDepot || question.questionDepotId)) {
                    itemPool.data.entryDepot = true;
                } else {
                    itemPool.data.entryDepot = false;
                }
            } else {
                itemPool.data = { entryDepot: true };
            }
        },
        saveQuestion: function(payload) {
            var me = this,
                mod = me.module.module,
                question = me.models.question,
                state = me.models.state,
                callback = me.module.renderOptions.callback,
                currentUser = this.app.global.currentUser,
                organizationId = payload.organizationId || currentUser.companyOrganization.id,
                r;

            this.models.question.set(
                D.assign(payload, {
                    organizationId: organizationId,
                    id: this.models.key.data.id
                })
            );

            return this.save(this.models.question).then(function() {
                me.app.message.success('保存成功');
                if (callback) {
                    r = D.assign(state.data, {
                        id: question.data.id,
                        questionAttrs: state.data.questionAttrs,
                        questionDepot: state.data.questionDepot
                    });
                    callback(covert(r));
                } else {
                    me.get(mod.store.models.questions);
                }
                me.models.state.clear();
                me.models.key.clear();
                me.renderOptions = {};
            });
        },
        refresh: function() {
            delete this.module.renderOptions.question;
            this.models.state.changed();
        },
        reloadItemPool: function() {
            this.models.itemPool.changed();
        }
    }
};

exports.buttons = function() {
    var interim = this.renderOptions.interim,
        buttons = [],
        preview,
        save,
        saveAndAdd;
    preview = {
        text: '预览',
        fn: function() {
            var mod = this.items.question.getEntities()[0],
                mainView = this.items.main,
                itemPoolView = this.items['item-pool'],
                validate1 = itemPoolView.validate(),
                validate2 = mainView.validate(),
                validate3 = mod.isValidate(),
                data0 = this.items['item-pool'].getData(),
                data1 = this.items.main.getData(),
                data2 = mod.getValue(),
                result = getData(D.assign({}, data0, data1, data2)),
                me = this;

            if (!validate1 || !validate2 || !validate3) {
                return false;
            }

            if (!data2) {
                return false;
            }

            if (Number(result.type) === 6) result.subs = result.questionAttrs;
            this.store.models.state.set(result);
            me.app.viewport.modal(me.items.preview);
            return false;
        }
    };

    save = {
        text: '保存',
        fn: function() {
            var mod = this.items.question.getEntities()[0],
                mainView = this.items.main,
                itemPoolView = this.items['item-pool'],
                optionData = mod.getValue(),
                validate1 = itemPoolView.validate(),
                validate2 = mainView.validate(),
                validate3 = mod.isValidate(),
                result;

            if (!validate1 || !validate2 || !validate3) {
                return false;
            }

            if (!optionData) return false;
            if (Number(optionData.type) === 6) {
                _.forEach(optionData.questionAttrs, function(q) {
                    var qq = q;
                    qq.score = q.score * 100;
                });
            }
            result = getData(
                D.assign(
                    {},
                    optionData,
                    itemPoolView.getData(),
                    mainView.getData(),
                    { score: Number(optionData.score * 100).toFixed(0) }
                )
            );
            mod.clear();
            if (this.renderOptions.callback) {
                D.assign(this.store.models.state.data, result);
            }

            return this.dispatch('saveQuestion', result);
        }
    };

    saveAndAdd = {
        text: '保存并新增',
        fn: function() {
            var me = this;
            save.fn.call(this).then(function() {
                return me.dispatch('init', me.store.models.tempAddQuestionOptions.data).then(function() {
                    me.store.models.state.changed();
                    me.store.models.itemPool.changed();
                });
            });
            return false;
        }
    };

    if (interim) {
        buttons.push(save);
        buttons.push(saveAndAdd);
    } else {
        buttons.push(preview);
        buttons.push(save);
    }
    return buttons;
};


getData = function(data) {
    var result = {},
        value = JSON.stringify(data.questionAttrs);

    result.value = value;
    return D.assign(result, data);
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

covert = function(record) {
    if (Number(record.type) !== 6) return record;
    D.assign(record, {
        subs: JSON.parse(record.value)
    });
    return record;
};
