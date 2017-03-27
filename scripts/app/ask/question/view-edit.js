exports.bindings = {
    img: false
};
exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}];
exports.dataForActions = {
    save: function() {
        return this.components.content.html();
    }
};
exports.mixin = {
    getData: function() {
        return this.components.content.html();
    }
};
