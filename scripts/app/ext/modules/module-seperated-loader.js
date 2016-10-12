var D = require('drizzlejs'),
    ModuleSeperatedLoader;

/* eslint-disable no-underscore-dangle */
module.exports = ModuleSeperatedLoader = function() {
    ModuleSeperatedLoader.__super__.constructor.apply(this, arguments);
    this.path = this._option('path');
    this.views = this._option('views');
    this.module = this._option('module');
};

D.extend(ModuleSeperatedLoader, D.Loader, {
    loadView: function(name, mod) {
        if (this.views.indexOf(name) !== -1) {
            return mod.options.views[name];
        }

        return ModuleSeperatedLoader.__super__.loadView.call(this, name, mod);
    }
});
/* eslint-enable no-underscore-dangle */
