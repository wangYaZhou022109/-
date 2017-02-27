var D = require('drizzlejs'),
    Engine;

Engine = function() {
    Engine.__super__.constructor.apply(this, arguments); // eslint-disable-line no-underscore-dangle
};

D.extend(Engine, D.TemplateEngine, {
    _loadIt: function() {
        return null;
    },

    _execute: function(renderable, data) {
        var el = renderable._getElement(); // eslint-disable-line no-underscore-dangle
        el.innerHTML = this.options.callback(data, renderable);
        this.executeIdReplacement(el, renderable);
    }
});

module.exports = Engine;
