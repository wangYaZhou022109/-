
exports.bindings = {
    state: true
};

exports.components = [function() {
    var obj = {
        id: 'code',
        name: 'qrcode',
        options: {
            text: this.bindings.state.data.id
        }
    };
    return obj;
}];
