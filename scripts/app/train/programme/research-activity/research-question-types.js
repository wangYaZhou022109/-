var map = {
        1: 'choise',
        2: 'choise',
        3: 'judgement',
        4: 'sentence-completion',
        5: 'question-answer',
        6: 'reading-comprehension',
        7: 'line',
        8: 'sorting'
    },
    mode = {
        1: 'summary-detail',
        2: 'answer-detail',
        3: 'answer',
        4: 'preview'
    },
    typeToName = function(t, m) {
        return 'train/programme/research-activity/question/types/' + mode[m] + '/' + map[t];
    };

exports.get = function(t, m) {
    return typeToName(t, m);
};

exports.map = map;

