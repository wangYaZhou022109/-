var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    getQuestionDepotSearchItem,
    OPTION_ALL = '999';

exports.title = '查找试题';

exports.buttons = [{
    text: '确定',
    action: 'refreshList'
}];

exports.events = {
    'click search': 'showModal'
};

exports.handlers = {
    showModal: function() {
        this.app.viewport.modal(this.module.items.modal);
    }
};

exports.dataForActions = {
    refreshList: function(d) {
        var params = {},
            me = this;
        _.map(d, function(v, k) {
            params[k] = v !== OPTION_ALL ? v : null;
            if (k === 'questionDepotId' && v !== '') {
                params[k] = getQuestionDepotSearchItem.call(me, v, k).id;
            }
        });
        return params;
    },
    // 暂时无用
    doSearch: function(d) {
        var me = this;
        return _.map(d, function(v, k) {
            if (k === 'type') {
                return v !== OPTION_ALL ? { text: maps['question-types'][v], id: v, type: k } : {};
            }
            if (k === 'difficulty') {
                return v !== OPTION_ALL ? { text: maps['question-difficultys'][v], id: v, type: k } : {};
            }
            if (k === 'status') {
                return v !== OPTION_ALL ? { text: maps['publish-status'][v], id: v, type: k } : {};
            }
            if (k === 'subjective') {
                return v !== OPTION_ALL ? { text: maps['question-is-subjective'][v], id: v, type: k } : {};
            }
            if (k === 'questionDepotId' && v !== '') {
                return getQuestionDepotSearchItem.call(me, v, k);
            }
            return { type: k, id: v, text: v };
        });
    }
};

exports.components = [{
    id: 'type',
    name: 'selectize'
}, {
    id: 'difficulty',
    name: 'selectize'
}, {
    id: 'status',
    name: 'selectize'
}, {
    id: 'subjective',
    name: 'selectize'
}, {
    id: 'start-time',
    name: 'pickadate'
}, {
    id: 'end-time',
    name: 'pickadate'
}, function() {
    var obj = {
        id: 'questionDepot',
        name: 'picker',
        options: {
            module: 'train/programme/exam/question-depot',
            picker: 'question-depot',
            required: false,
            inputName: 'questionDepotId',
            params: { operatorType: this.app.global.EDIT },
            data: {}
        }
    };
    return obj;
}];

exports.dataForTemplate = {
    type: function() {
        var result = maps.get('question-types');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return result;
    },
    difficultys: function() {
        var result = maps.get('question-difficultys');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return result;
    },
    status: function() {
        var result = maps.get('publish-status');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return result;
    },
    subjective: function() {
        var result = maps.get('question-is-subjective');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return result;
    }
};

getQuestionDepotSearchItem = function(v, k) {
    var data = this.components.questionDepot.store.models.list.data;
    return { text: _.find(data, ['id', v]).name, id: v, type: k };
};
