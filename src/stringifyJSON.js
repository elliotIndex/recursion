// stringifyJSON turns objects into JSON formatted strings

// Helper function to put quotes around strings
var addString = function(curStr, newStr){
  return curStr + "\"" + newStr + "\"";
}

var stringifyJSON = function(obj) {
  // Handle null or undefined objects
  if (!obj) { return "" + obj; }

  var type = typeof(obj);

  // Handle primitive types and strings
  if (type != "object") {
    return type == "string" ? addString("", obj) : obj.toString();
  }

  // Handle Arrays and Objects
  var isArr = Array.isArray(obj);
  var out = isArr ? "[" : "{"; // Add opening character
  var valType;
  for (var key in obj) {
    if ( key != "undefined" && key != "functions") { // Not sure what "funcitons" is
      // Insert key if obj is an object
      if (!isArr) {
        out = addString(out, key) + ":";
      }

      valType = typeof(obj[key]);

      if (valType == "object") {
        out += stringifyJSON(obj[key]); // Recursive call
      } else if (valType == "string") {
        out = addString(out, obj[key]);
      } else {
        out += obj[key];
      }
      out += ","; // comma separate values
    }
  }
  out = out[out.length-1] == "," ? out.slice(0, -1) : out; // Remove final comma
  out += isArr ? "]" : "}"; // Add closing character
  return out;
};
