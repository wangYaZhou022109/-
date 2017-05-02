// exports.type = 'form';

exports.bindings = {
    img: true,
    state: true
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}];
