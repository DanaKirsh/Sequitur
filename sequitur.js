$(document).ready(function() {
  $("#input").on("change paste keyup", function() {
    $("#result").text(sequitur($("#input").val()));
  });
});

function sequitur(str) {
  var s = [str.charAt(0)];
  var dict = {'currentRule': 'A', rules: {}};
  for (var i = 1; i < str.length; i++) {
    s.push(str.charAt(i));
    s = compress(s, dict)
  }
  str = "S \u2192 " + s.join("");
  delete dict['currentRule'];
  Object.keys(dict.rules).forEach(function(key, index) {
    str = str + "\n" + dict.rules[key] + "\u2192" + key; 
  });
  return str;
}

function compress(s, dict) {
    var digrams = {};
    for (var i = 0; i < s.length - 1; i++) {
      var digram = s[i] + s[i + 1];
      if (dict.hasOwnProperty(digram)) {
        replace2Elements(s, i, dict.rules[digram]);
      }
      else if (digrams.hasOwnProperty(digram) && digrams[digram] != i - 1) {
        var currentRule = dict['currentRule']
        dict.rules[digram] = currentRule;
        replace2Elements(s, i, currentRule);
        replace2Elements(s, digrams[digram], currentRule);
        delete digrams[digram];
        dict['currentRule'] = inrementRule(currentRule);
      }
      else {
        if (!digrams.hasOwnProperty(digram))
         digrams[digram] = i;
      }
    }
  return s;
}

function replace2Elements(arr, index, elem) {
  arr.splice(index, 1);
  arr[index] = elem;
}

function inrementRule(s) {
  var lastChar = s.slice(-1);
  if (lastChar == 'Z')
    return s + 'A';
  return s.slice(0, -1) + String.fromCharCode(lastChar.charCodeAt(0) + 1);
}