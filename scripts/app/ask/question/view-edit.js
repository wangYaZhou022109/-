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

exports.mixin = {
    getData: function() {
        return this.components.content;
    }
};
