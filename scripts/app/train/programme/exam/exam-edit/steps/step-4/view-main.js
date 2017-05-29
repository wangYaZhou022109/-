var maps = require('./app/util/maps'),
    qtypes = maps['question-types'],
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    types = [
        { id: 1, type: 1, name: '单选' },
        { id: 2, type: 2, name: '多选' },
        { id: 3, type: 3, name: '判断' },
        { id: 4, type: 8, name: '排序' },
        // { id: 5, type: 7, name: '连线' },
        { id: 6, type: 4, name: '填空' },
        { id: 7, type: 5, name: '问答' },
        { id: 8, type: 6, name: '阅读理解' }
    ],
    $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    STARTING = 5;

// exports.type = 'form';

exports.bindings = {
    exam: true,
    paperClass: true
};

exports.events = {
    'click add-temp-paper': 'addPaper',
    'click preview-paper': 'previewPaper',
    'click add-tactic': 'addTactic'
};

exports.handlers = {
    addPaper: function() {
        var view = this.module.items['train/programme/exam/paper/add-paper'],
            that = this,
            paperClassId;
        if (this.bindings.paperClass.data && this.bindings.paperClass.data.type === 2) {
            paperClassId = this.bindings.paperClass.data.id;
        }
        this.app.viewport.modal(view, {
            id: paperClassId,
            url: this.module.renderOptions.url,
            paperName: this.bindings.exam.data.name,
            type: 2,
            callback: function(id) {
                return that.module.dispatch('selectPaperId', id);
            }
        });
    },
    previewPaper: function() {
        var paperClass = this.bindings.paperClass.data,
            id = paperClass && paperClass.id,
            type = paperClass && paperClass.type,
            exam = this.bindings.exam.data,
            view = this.module.items['train/programme/exam/paper/preview-paper'];
        if (type === 3) {
            this.app.message.error('随机组卷不提供预览 ');
            return false;
        }
        if (id) {
            return this.app.viewport.modal(view, {
                paperId: id,
                exam: D.assign(exam, {
                    paperSortRule: $(this.$$('[name="paperSortRule"]')).val(),
                    paperShowRule: $(this.$$('[name="paperShowRule"]')).val() || exam.paperShowRule //  兼容课程添加试卷
                })
            });
        }
        this.app.message.error('没有试卷内容');
        return true;
    },
    addTactic: function() {
        var me = this,
            paperClassId,
            exam = this.bindings.exam.data,
            paperClass = this.bindings.paperClass,
            currentUser = this.app.global.currentUser;

        if (paperClass.data && paperClass.data.type === 3) { // 随机组卷
            paperClassId = paperClass.data.id;
        }
        me.app.viewport.modal(me.module.items['train/programme/exam/question/random-question'], {
            paperClassId: paperClassId,
            url: this.module.renderOptions.url,
            organizationId: exam.organizationId || currentUser.organization.id,
            callback: function(data) {
                return me.module.dispatch('selectPaperId', data);
            }
        });
    }
};

exports.dataForTemplate = {
    paperCount: function(data) {
        var paper = data.paperClass,
            questionClass,
            questionTactics,
            count,
            temp,
            remote = _.map(_.orderBy(types, ['id', 'asc']), function(t) {
                return {
                    count: '-',
                    name: t.name,
                    score: '-',
                    type: t.type
                };
            });
        if (paper) {
            questionClass = paper.paperClassQuestions;
            questionTactics = paper.paperClassTactics;
            count = { count: 0, score: 0 };
            if (paper.type === 3) {
                questionTactics.forEach(function(question) {
                    var score = question.score,
                        type = question.type,
                        amount = question.amount,
                        countItem = count[type] || { score: 0, count: 0, name: qtypes[type] };
                    countItem.score += (score * amount) / 100;
                    countItem.count += amount;
                    count[type] = countItem;
                    count.score += (score * amount) / 100;
                    count.count += amount;
                });
            } else if (questionClass) {
                questionClass.forEach(function(question) {
                    var score = question.score;
                    var type = question.question && question.question.type;
                    var countItem = count[type] || { score: 0, count: 0, name: qtypes[type] };
                    countItem.score += score / 100;
                    countItem.count ++;
                    count[type] = countItem;
                    count.count ++;
                    count.score += score / 100;
                });
            }
        }

        temp = _.map(remote, function(r) {
            var obj = count[r.type];
            if (obj) {
                return obj;
            }
            return r;
        });
        temp.count = count.count;
        temp.score = count.score;
        return temp;
    },
    checked: function(data) {
        var exam = data.exam;
        return {
            paperShowRule1: '' + exam.paperShowRule === '1',
            paperShowRule2: '' + exam.paperShowRule === '2',
            paperSortRule1: '' + exam.paperSortRule === '1',
            paperSortRule2: '' + exam.paperSortRule === '2',
            paperSortRule3: '' + exam.paperSortRule === '3',
            paperSortRule4: '' + exam.paperSortRule === '4',
        };
    },
    showPaperShowRule: function() {
        return this.module.renderOptions.hidePaperShowRule !== 1;
    },
    previousStatusIsStarting: function(data) {
        return data.exam.previousStatus && data.exam.previousStatus === STARTING;
    },
    isPaperTactic: function(data) {
        return data.paperClass.type === 3;
    }
};

exports.mixin = {
    validate: function() {
        var name = $(this.$('paperClassId')),
            flag = true;

        markers.text.valid(name);

        if (name.val().trim() === '' || name.val().trim() === null) {
            flag = false;
        }

        return flag;
    }
};

// exports.components = [{
//     id: 'paperSortRule',
//     name: 'selectize'
// },
// // {
// //     id: 'paperShowRule',
// //     name: 'selectize'
// // }
// ];
