

// Parsemaker returns a function that parses JSON formtted strings
var parseMaker = function() {
      // recursively call parse on objects, 
      // Be able to handle all types of JSON data
      	// includes objects, arrays, strings, numbers, bools, and null

      // outer function that returns parse function
  var curIndex; // current index
  var curChar; // current character
  var jsonString; // JSON string being parsed
  var escChars = {	// Chars used to escape strings
    '"':  '"',
    '\\': '\\',
    '/':  '/',
    b:    '\b',
    f:    '\f',
    n:    '\n',
    r:    '\r',
    t:    '\t'
  };

  // Function to throw an error if something goes wrong
  var error = function (msg) {
    throw 'SyntaxError';
    // could use message, but prompt doesn't like that
  };

  // Get next character in JSON string
  var next = function (check) {
    // checks to make sure the current character matches what is expected (if expected is provided)
    if (check && check !== curChar) {
      error("Expected '" +  + "' but saw '" + curChar + "'");
    }

    // Gets the next character, will return "" if there are no more characters
    curChar = jsonString.charAt(curIndex);
    curIndex += 1;
    return curChar;
  };

  // Turn a number formatted as a string into an actual number
  var number = function () {

    var numString = '';

    // handle negative numbers
    if (curChar === '-') {
      numString = '-';
      next('-');
    }

    // Get all digits before the decimal place or exponential modifier
    while (curChar >= '0' && curChar <= '9') {
      numString += curChar;
      next();
    }

    // Get decimal place
    if (curChar === '.') {
      numString += '.';

      // Gather digits after decimal place
      while (next() && curChar >= '0' && curChar <= '9') {
        numString += curChar;
      }
    }

    // Check for exponential notation
    if (curChar === 'e' || curChar === 'E') {
      numString += curChar;
      next();

      // Check for negative (or positive) exponent
      if (curChar === '-' || curChar === '+') {
        numString += curChar;
        next();
      }

      // Gather exponent
      while (curChar >= '0' && curChar <= '9') {
        numString += curChar;
        next();
      }
    }

    // Convert number string to number format (javascript is cool)
    var number = +numString;

    if (isNaN(number)) {
      error("Incorrect Number Format");
    } else {
      return number;
    }
  };


  // Parse a string value with unicode characters
  var string = function () {

    var hex; // Hexadecimal value in string
    var uni;  // Unicode value in string, follows \u
    var string = '';

    // String Opening
    if (curChar === '"') {
      while (next()) {
        if (curChar === '"') { // Closing String Char
          next();
          return string;
        } else if (curChar === '\\') {  // Escapement char
          next();
          if (curChar === 'u') { // get unicode string
            uni = 0;
            for (var i = 0; i < 4; i++) {
              hex = parseInt(next(), 16); // Convert hex value to int (3 -> 3, A -> 10, F -> 15)
              if (!isFinite(hex)) {
                break;  // bad hex value, ie a letter >= G
              }
              uni = uni * 16 + hex;
            }
            string += String.fromCharCode(uni);
          } else if (typeof escChars[curChar] === 'string') { // Any escapement char other than \u just gets passed on normally
            string += escChars[curChar];
          } else {
            break;
          }
        } else {  // Normal char in string
          string += curChar;
        }
      }
    }
    error("Incorrect String Format");
  };

  // Skip over whitespace
  var white = function () {
    while (curChar && curChar <= ' ') {
      next();
    }
  };

  // Get true, false, or null values
  var word = function () {

    if (curChar === 't') {
      next('t');
      next('r');
      next('u');
      next('e');
      return true;
    } else if (curChar === 'f') {
      next('f');
      next('a');
      next('l');
      next('s');
      next('e');
      return false;
    } else if (curChar === 'n') {
      next('n');
      next('u');
      next('l');
      next('l');
      return null;
    } else {
      error("Unexpected character: '" + ch + "'");
    }
  };
  
  // Placeholder for the value function, used in array() and object() but defined after them
  var value;  

  // Parse an array with JSON data types inside (including arrays and objects)
  var array = function () {

    var array = [];

    if (curChar === '[') { // opening array char
      next('[');
      white();
      if (curChar === ']') { // check for empty array
        next(']');
        return array;
      }
      while (curChar) {
        array.push(value());  // Recursive call to nested data, including objects and arrays
        white();
        if (curChar === ']') {
          next(']');
          return array;
        }
        white(); // May be unneccesary 
        next(',');
        white();
      }
    }
    error("Incorrect Array Format");
  };

  // Parse an object with JSON data types inside (including arrays and objects)
  var object = function () {

    var key;
    var object = {};

    if (curChar === '{') {  // Object opening char
      next('{');
      white();
      if (curChar === '}') {  // Check for empty object
        next('}');
        return object;
      }
      while (curChar) {
        key = string(); // Use JSON formatted string function to get key
        white();
        next(':');
        object[key] = value(); // Recursive call to nested data, including objects and arrays
        white();
        if (curChar === '}') {  // End of object char
          next('}');
          return object;
        }
        white();
        next(',');
        white();
      }
    }
    error("Incorrect Object Format");
  };

  // Handler function for all JSON values. Determines data type and calls appropriate function
  var value = function () {
    white();
    if (curChar === '{') {
      return object();
    } else if (curChar === '[') {
      return array();
    } else if (curChar === '"') {
      return string();
    } else if (curChar === '-' || (curChar >= '0' && curChar <= '9')) {
      return number();
    } else {
      return word();
    }
  };


  // Return the parseJSON function, which has access to all of the functions defined in this closure
  return function (json) {
    var result;

    jsonString = json;
    curIndex = 0;
    curChar = ' ';
    result = value(); // Will enter object() on first call
    white();
    if (curChar) {
      error("Unexpected Characters at End of JSON String");
    }
    return result;
  };
};

var parseJSON = parseMaker();
