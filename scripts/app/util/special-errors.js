var codes = [
    30117,
    30126
];

exports.hasCode = function(code) {
    return codes.join(',').indexOf(code) > -1;
};
