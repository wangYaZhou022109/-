var D = require('drizzlejs'),
    _ = require('lodash/collection');
exports.bindings = {
    classInfo: true,
    state: true
};

exports.events = {
    'click satisfaction-*': 'showStatisfaction',
    'click toExam-*': 'toExam',
    'click busView-*': 'toBusView',
    'click item-*': 'toggleclass',
    'click search': 'toSearch',
    'click inClass*': 'comeInClass',
    'click seeClass*': 'seeClass'
};

exports.dataForTemplate = {
    classInfo: function(data) {
        return _.map(data.classInfo, function(c) {
            var busList = c.busList,
                classEvaluate = c.classEvaluate,
                nowDate = (new Date()).getTime();
            busList = _.map(busList, function(b) {
                if (b.endTime > nowDate) {
                    return D.assign(b, { size: 1 });
                }
                return b;
            });
            classEvaluate = _.map(classEvaluate, function(e) {
                if (e.endTime > nowDate) {
                    return D.assign(e, { pass: 1 });
                }
                return e;
            });
            return D.assign(c, { busList: busList, classEvaluate: classEvaluate });
        });
    },
    isAll: function() {
        var state = this.bindings.state;
        if (Number(state.data.tab) === 0) {
            return true;
        }
        return false;
    },
    isNotFinish: function() {
        var tab = this.bindings.state.data.tab;
        if (Number(tab) === 1) {
            return true;
        }
        return false;
    },
    isNotStart: function() {
        var state = this.bindings.state;
        if (Number(state.data.tab) === 2) {
            return true;
        }
        return false;
    },
    isFinish: function() {
        var state = this.bindings.state;
        if (Number(state.data.tab) === 3) {
            return true;
        }
        return false;
    }
};

exports.handlers = {
    showStatisfaction: function(id) {
        var url = '#/train/class-detail/research-detail/' + id;
        window.open(url, '_blank');
    },
    toExam: function(resourceId) {
        var url = '#/exam/exam/paper/' + resourceId;
        window.open(url, '_blank');
    },
    toBusView: function(busId, e, target) {
        var model = this.module.items['train/class-detail/class-bus'],
            classId = target.getAttribute('busClassId');
        this.module.dispatch('getTrainee', { classId: classId }).then(function(data) {
            var trainee = data[0];
            this.app.viewport.modal(model, { busId: busId, classId: classId, traineeId: trainee.id });
        });
    },
    toggleclass: function(id) {
        var state = this.bindings.state,
            status = id;
        state.data = {};
        state.data.tab = id || 0;
        state.data[id] = true;
        state.changed();
        return this.module.dispatch('refreshList', { status: status });
    },
    toSearch: function() {
        var name = this.$('name').value;
        this.module.dispatch('refreshList', { name: name });
    },
    comeInClass: function(id) {
        var url = '#/train/class-detail/' + id;
        window.open(url, '_blank');
    },
    seeClass: function(id) {
        var url = '#/train/class-detail/' + id + '?see';
        window.open(url, '_blank');
    }
};

