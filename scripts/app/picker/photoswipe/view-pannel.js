exports.bindings = {
    photos: true,
    state: false
};
exports.components = [function() {
  var photos = this.bindings.photos.data || [],
      index = this.bindings.state.data.index;
    return {
        id: 'swipe',
        name: 'photoswipe',
        options: {
          photos: photos,
          index: index
        }
    };
}];
