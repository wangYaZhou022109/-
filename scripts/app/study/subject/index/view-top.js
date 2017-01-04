exports.bindings = {
    search: false
};
exports.actions = {
    'click searchByName': 'searchByName'

};
exports.events = {
    'keypress searchContent': 'keyPressByName'
};

exports.handlers = {
    keyPressByName: function(key) {
        if (key.keyCode === 13) {
            this.module.dispatch('searchByName', {
                name: key.target.value
            });
        }
    }
};
