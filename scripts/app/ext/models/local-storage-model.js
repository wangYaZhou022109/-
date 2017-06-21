var D = require('drizzlejs'),
    LocalStorageModel;

/* eslint-disable no-underscore-dangle */
LocalStorageModel = function() {
    LocalStorageModel.__super__.constructor.apply(this, arguments);
    this.load();
};

D.extend(LocalStorageModel, D.Model, {
    _key: function(k) {
        var key = 'Model.' + this.name + '.' + this.module.name + '.LS';
        if (this.app.global.currentUser) {
            key += '.' + this.app.global.currentUser.id;
        }
        if (k) return key + '.' + k;
        return key;
    },

    clear: function() {
        LocalStorageModel.__super__.clear.apply(this, arguments);
        localStorage.removeItem(this._key());
    },

    clearByKey: function(key) {
        LocalStorageModel.__super__.clear.apply(this, arguments);
        localStorage.removeItem(this._key(key));
    },

    save: function() {
        localStorage.setItem(this._key(), JSON.stringify(this.data));
    },

    saveByKey: function(key) {
        localStorage.setItem(this._key(key), JSON.stringify(this.data));
    },

    load: function() {
        var data = localStorage.getItem(this._key());
        this.data = JSON.parse(data);
    },

    loadByKey: function(key) {
        var data = localStorage.getItem(this._key(key));
        this.data = JSON.parse(data);
    }
});
/* eslint-enable no-underscore-dangle */

D.registerModel('localStorage', LocalStorageModel);
