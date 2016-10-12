var D = require('drizzlejs'),
    map = {
        1: 'choise',
        2: 'choise',
        3: 'judgement',
        4: 'sentence-completion',
        5: 'question-answer',
        6: 'reading-comprehension',
        7: 'line',
        8: 'sorting'
    };

D.ComponentManager.register('question', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'picker'),
        question,
        show = function(opt) {
            var type = map[opt.type],
                mode = opt.mode || 'edit';

            return view.chain(region.show('exam/question/types/' + mode + '/' + type, opt), function(m) {
                question = m;
                return m;
            });
        };

    return view.chain(show(options || {}), function() {
        return {
            question: function() { return question; },
            getValue: function() { return question.getValue(); },
            reset: function(opt, model) {
                var o = opt;
                o.model = model;
                return show(o || {});
            }
        };
    });
}, function(view, comp) {
    comp.question()._region.close();   // eslint-disable-line no-underscore-dangle
});
