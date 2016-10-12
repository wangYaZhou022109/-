var D = require('drizzlejs'),
    ModuleSeperatedTemplateEngine;

/* eslint-disable no-underscore-dangle */
module.exports = ModuleSeperatedTemplateEngine = function() {
    ModuleSeperatedTemplateEngine.__super__.constructor.apply(this, arguments);
    this.path = this._option('path');
    this.views = this._option('views');
    this.module = this._option('module');
};

D.extend(ModuleSeperatedTemplateEngine, D.TemplateEngine, {
    _loadIt: function(renderable) {
        var name = renderable.name;

        if ((renderable instanceof D.Module && renderable !== this.module) ||
            (renderable instanceof D.View && renderable.module !== this.module)) {
            return ModuleSeperatedTemplateEngine.__super__._loadIt.call(this, renderable);
        }

        if (renderable === this.module) {
            return renderable._loader.loadResource(this.path);
        }

        if (renderable.module === this.module && this.views.indexOf(name) !== -1) {
            return function() { return renderable.module._template; };
        }
        return renderable._loader.loadModuleResource(renderable.module, 'templates');
    }
});
/* eslint-enable no-underscore-dangle */
