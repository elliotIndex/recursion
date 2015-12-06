// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var addString = function(curStr, newStr){
  return curStr + "\"" + newStr + "\"";
}
var stringifyJSON = function(obj) {
  // your code goes here
  // Handle Arrays
  if (Array.isArray(obj)){
    var out = "[";
    var valType;
    for (var i = 0; i < obj.length; i++) {
      valType = typeof(obj[i]);
      if (valType == "object") {
        out += stringifyJSON(obj[i]);
      } else if (valType == "string") {
        out = addString(out, obj[i]);
      } else {
        out += obj[i];
      }
      out += ","
    }
    out = out.slice(0, -1);
    out += "]";
    return out;
  } else {
    // Handle objects
    var out = "{";
    var valType;
    for (var key in obj) {
      out = addString(out, key);
      out += ":";
      valType = typeof(obj[key]);
      if (valType == "object") {
        out += stringifyJSON(obj[key]);
      } else if (valType == "string") {
        out = addString(out, obj[key]);
      } else {
        out += obj[key];
      }
      out += ",";
    }
    out = out.slice(0, -1);
    out += "}";
    return out;
  }
};
