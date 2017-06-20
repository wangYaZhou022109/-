var codes = [
    30117,
    30126,
    40205,
    40206
];

exports.hasCode = function(code) {
    return codes.join(',').indexOf(code) > -1;
};
