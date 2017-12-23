$(document).ready(function() {
  $("#input").on("change paste keyup", function() {
     $("#input").val($("#input").val().toLowerCase());
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
  str = "S\u2192" + s.join("");
  delete dict['currentRule'];
  Object.keys(dict.rules).forEach(function(key, index) {
    str = str + "\n" + dict.rules[key].name + "\u2192" + key + " (" + dict.rules[key].ocurrences +")";
  });
  return str;
}

function compress(s, dict) {
    var digrams = {};
    for (var i = 0; i < s.length - 1; i++) {
      var digram = s[i] + s[i + 1];
      if (dict.rules.hasOwnProperty(digram)) {
        replace2Elements(s, i, dict.rules[digram].name);
        dict.rules[digram].ocurrences++;
        i -= 2;
        if (updateOcurrencesDigram(dict, digram)) {
          i = 0;
          digrams = {};
        }
      }
      else if (digrams.hasOwnProperty(digram) && digrams[digram] != i - 1) {
        var currentRule = dict['currentRule']
        dict.rules[digram] = {'name': currentRule, 'ocurrences' : 2};
        replace2Elements(s, i, currentRule);
        replace2Elements(s, digrams[digram], currentRule);
        delete digrams[digram];
        dict['currentRule'] = inrementRule(currentRule);
        updateOcurrencesDigram(dict, digram);
      }
      else if (!digrams.hasOwnProperty(digram)) {
         digrams[digram] = i;
      }
    }
  return s;
}

function updateOcurrencesDigram(dict, digram) {
  updateOcurrencesOneChar(dict, 0, digram);
  updateOcurrencesOneChar(dict, 1, digram);  
}

function updateOcurrencesOneChar(dict, i, digram) {
  var char = digram.charAt(i);
  if (char.match(new RegExp("[A-Z]"))) {
    Object.keys(dict.rules).forEach(function(key, index) {
		var rule = dict.rules[key]
		  if (rule && rule.name == char) {
        rule.ocurrences--;
        if (rule.ocurrences == 1) {
          var newRule = dict.rules[digram];
          dict.rules[digram.replace(char, key)] = newRule;
          delete dict.rules[digram];
          delete dict.rules[key];
        }
		  }
    });
  }  
}

/* Merge a digram into a rule. */
function replace2Elements(arr, index, rule) {
  arr.splice(index, 1);
  arr[index] = rule;
}

/* Get next letter (rule name). */
function inrementRule(s) {
  var lastChar = s.slice(-1);
  return String.fromCharCode(lastChar.charCodeAt(0) + 1);
}