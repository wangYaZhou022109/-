var D = require('drizzlejs'),
    getData,
    titles = { add: '新增试题', edit: '修改试题' },
    covert,
    SINGLE_CHOOSE = 1;

exports.items = {
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
        question: { url: '../exam/dimension/question' },
        state: { data: {} },
        itemPool: { data: {} },
        tempAddQuestionOptions: {},
        key: {}
    },
    callbacks: {
        init: function(payload) {
            var question = payload.question || payload.data,
                state = this.models.state,
                tempAddQuestionOptions = this.models.tempAddQuestionOptions;

            tempAddQuestionOptions.set(payload);

            state.clear();
            state.data.type = payload.type || SINGLE_CHOOSE;


            this.models.question.set(question);
            if (question) this.models.key.set({ id: question.id });

            D.assign(state.data, question);
        },
        saveQuestion: function(payload) {
            var me = this,
                mod = me.module.module,
                question = me.models.question,
                state = me.models.state,
                callback = me.module.renderOptions.callback,
                tempAddQuestionOptions = me.models.tempAddQuestionOptions,
                r;
            this.models.question.set(D.assign(state.data, payload, this.module.renderOptions.data));
            return this.save(this.models.question).then(function(data) {
                me.app.message.success('保存成功');
                if (callback) {
                    r = D.assign(state.data, {
                        id: question.data.id,
                        dimensionId: question.data.dimensionId,
                        questionAttrs: state.data.questionAttrs
                    });
                    callback(covert(r));
                } else {
                    me.get(mod.store.models.questions);
                }
                me.models.state.clear();
                me.models.key.clear();
                me.renderOptions = {};
                D.assign(tempAddQuestionOptions.data.data, {
                    dimensionId: question.data.dimensionId
                });
                return data;
            });
        },
        refresh: function() {
            delete this.module.renderOptions.question;
            this.models.state.changed();
        }
    }
};

exports.buttons = function() {
    var buttons = [],
        // preview,
        save,
        saveAndAdd;
    // preview = {
    //     text: '预览',
    //     fn: function() {
    //         var mod = this.items.question.getEntities()[0],
    //             mainView = this.items.main,
    //             mainValidate = mainView.validate(),
    //             questionValidate = mod.isValidate(),
    //             mainData = this.items.main.getData(),
    //             questonData = mod.getValue(),
    //             result = getData(D.assign({}, mainData, questonData)),
    //             me = this;

    //         if (!mainValidate || !questionValidate) {
    //             return false;
    //         }

    //         if (!questonData) {
    //             return false;
    //         }

    //         if (Number(result.type) === 6) result.subs = result.questionAttrs;
    //         this.store.models.state.set(result);
    //         me.app.viewport.modal(me.items.preview);
    //         return false;
    //     }
    // };

    save = {
        text: '保存',
        fn: function() {
            var mod = this.items.question.getEntities()[0],
                mainView = this.items.main,
                questionData = mod.getValue(),
                mainValidate = mainView.validate(),
                questionValidate = mod.isValidate(),
                result;

            if (!mainValidate || !questionValidate) {
                return false;
            }

            if (!questionData) return false;

            result = getData(
                D.assign(
                    {},
                    questionData,
                    mainView.getData(),
                    this.renderOptions.data,
                    { score: questionData.score ? questionData.score * 100 : null }
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
            if (save.fn.call) {
                return save.fn.call(this).then(function() {
                    return me.dispatch('init', me.store.models.tempAddQuestionOptions.data).then(function() {
                        me.store.models.state.changed();
                        return false;
                    });
                });
            }
            return false;
        }
    };

    // buttons.push(preview);
    if (this.renderOptions.titleType === 'edit') {
        buttons.push(save);
    } else {
        buttons.push(save);
        buttons.push(saveAndAdd);
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
