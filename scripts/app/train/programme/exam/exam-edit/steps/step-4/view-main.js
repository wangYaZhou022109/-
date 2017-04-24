var maps = require('./app/util/maps'),
    qtypes = maps['question-types'],
    _ = require('lodash/collection'),
    types = [
        { id: 1, type: 1, name: '单选' },
        { id: 2, type: 2, name: '多选' },
        { id: 3, type: 3, name: '判断' },
        { id: 4, type: 8, name: '排序' },
        { id: 5, type: 7, name: '连线' },
        { id: 6, type: 4, name: '填空' },
        { id: 7, type: 5, name: '问答' },
        { id: 8, type: 6, name: '阅读理解' }
    ];

// exports.type = 'form';

exports.bindings = {
    exam: true,
    paperClass: true
};

exports.events = {
    'click select-paper': 'selectPaper',
    'click add-temp-paper': 'addPaper',
    'click preview-paper': 'previewPaper',
    'click add-tactic': 'addTactic'
};

exports.handlers = {
    addPaper: function() {
        var view = this.module.items['train/programme/exam/paper/add-paper'],
            that = this;
        var paperClassId;
        if (this.bindings.paperClass.data && this.bindings.paperClass.data.type === 2) {
            paperClassId = this.bindings.paperClass.data.id;
        }
        this.app.viewport.modal(view, {
            id: paperClassId,
            type: 2,
            callback: function(id) {
                that.app.viewport.closeGround();
                that.module.dispatch('selectPaperId', id);
            }
        });
    },
    selectPaper: function() {
        var view = this.module.items['train/programme/exam/paper/select-paper'],
            that = this;
        this.app.viewport.modal(view, {
            callback: function(data) {
                that.app.viewport.closePopup();
                that.module.dispatch('selectPaper', data);
            }
        });
    },
    previewPaper: function() {
        var paperClass = this.bindings.paperClass.data,
            id = paperClass && paperClass.id,
            type = paperClass && paperClass.type,
            view = this.module.items['train/programme/exam/paper/preview-paper'];
        if (type === 3) {
            this.app.message.error('随机组卷不提供预览 ');
            return false;
        }
        if (id) {
            return this.app.viewport.modal(view, {
                paperId: id,
                exam: this.bindings.exam.data
            });
        }
        this.app.message.error('请先选择试卷');
        return true;
    },
    addTactic: function() {
        var me = this,
            paperClassId,
            exam = this.bindings.exam.data,
            currentUser = this.app.global.currentUser;

        if (this.bindings.paperClass.data && this.bindings.paperClass.data.type === 3) { // 随机组卷
            paperClassId = this.bindings.paperClass.data.id;
        }
        me.app.viewport.modal(me.module.items['train/programme/exam/exam-edit/steps/step-4/random-question'], {
            paperClassId: paperClassId,
            organizationId: exam.ownedOrganizationId || currentUser.organization.id,
            callback: function(data) {
                me.app.viewport.closeModal();
                me.module.dispatch('selectPaperId', data);
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
                    countItem.score += score * amount;
                    countItem.count += amount;
                    count[type] = countItem;
                    count.score += score * amount;
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
