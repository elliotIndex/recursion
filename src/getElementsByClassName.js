// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:

var getElementsByClassName = function(className, inside){

  // recursively call itself to make sure document is top level "this"
  if (!inside) { // first call should be to #document
    return getElementsByClassName.apply(document.body, [className, true]);
  }
  var out = [];
  // use String includes function, not supported by IE or Opera
  if (this.className && this.className.includes(className)) {
    out.push(this);
  }

  // recursively call on the child nodes of the current node
  _.each(this.childNodes, function(element) {
    out = out.concat(getElementsByClassName.apply(element, [className, true]));
  })
  return out;
}
