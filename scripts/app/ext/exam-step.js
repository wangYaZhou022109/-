var D = require('drizzlejs'),
    map = {
        1: 'step-1',
        2: 'step-2',
        3: 'step-3',
        4: 'step-4'

    };

D.ComponentManager.register('exam-step', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'picker'),
        question,
        show = function(opt) {
            var type = map[opt.type];

            return view.chain(region.show('exam/exam/step/' + type, opt), function(m) {
                question = m;
                return m;
            });
        };

    return view.chain(show(options || {}), function() {
        return {
            question: function() { return question; },
            reset: function(opt) {
                return show(opt || {});
            }
        };
    });
}, function(view, comp) {
    comp.question()._region.close();   // eslint-disable-line no-underscore-dangle
});
