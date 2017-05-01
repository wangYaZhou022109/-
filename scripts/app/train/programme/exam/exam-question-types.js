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
        1: 'edit',
        2: 'preview',
        3: 'answer',
        4: 'mark',
        5: 'research-answer-summary',
        6: 'research-detail-summary'
    },
    typeToName = function(t, m) {
        return 'train/programme/exam/question/types/' + mode[m] + '/' + map[t];
    };

exports.get = function(t, m) {
    return typeToName(t, m);
};

exports.map = map;

