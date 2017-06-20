var codes = [
    30117,
    30126,
    40307,
    30521
];

exports.hasCode = function(code) {
    return codes.join(',').indexOf(code) > -1;
};
