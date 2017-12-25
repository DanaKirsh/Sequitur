/* Handler for change of string. */
$(document).ready(function() {
  $("#input").on("change paste keyup", function() {
     $("#input").val($("#input").val().toLowerCase());
    $("#result").text(sequiturFormat($("#input").val()));
  });
});

/* Formats sequitur output. */
function sequiturFormat(str) {
  var dict = sequitur(str);
  str = "S\u2192" + dict["s"];
  delete dict['currentRule'];
  Object.keys(dict.rules).forEach(function(key, index) {
    str = str + "\n" + dict.rules[key].name + "\u2192" + key + " (" + dict.rules[key].ocurrences +")";
  });
  return str;
}

/* Performs sequitur. */
function sequitur(str) {
  var dict = {'currentRule': 'A', rules: {}};
  var s = [str.charAt(0)];
  for (var i = 1; i < str.length; i++) {
    s.push(str.charAt(i));
    s = compress(s, dict);
  }
  dict["s"] = s.join("");
  return dict;
}

/* Main compression loop. */
function compress(s, dict) {
    var digrams = getRulesDigrams(dict);
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
        var currentRule = dict['currentRule'];
        replace2Elements(s, i, currentRule);
        if ((typeof digrams[digram]) == 'number') {
          replace2Elements(s, digrams[digram], currentRule);          
        }
        else {
          fixCurrentRules(dict, digram);
        }
        delete digrams[digram];
        dict.rules[digram] = {'name': currentRule, 'ocurrences' : 2};
        dict['currentRule'] = inrementRule(currentRule);
        updateOcurrencesDigram(dict, digram);
      }
      else if (!digrams.hasOwnProperty(digram)) {
         digrams[digram] = i;
      }
    }
	return s;
}

/* Gets all digrams in existing rules. */
function getRulesDigrams(dict) {
  var digrams = {};
  Object.keys(dict.rules).forEach(function(key, index) {
    for (var i = 0; i < key.length - 1; i++) {
      var digram = key.charAt(i) + key.charAt(i + 1);
      digrams[digram] = dict.rules[key].name; 
    }
  });
  return digrams;
}

/* Changes existing rules to use new rule. */
function fixCurrentRules(dict, digram) {
	Object.keys(dict.rules).forEach(function(oldRule) {
		if (oldRule.includes(digram)) {
		  var newRule = oldRule.replace(digram, dict.currentRule);
		  changeRule(dict, oldRule, newRule);
		}
	});
}

/* Changes an existing rule. */
function changeRule(dict, oldName, newName) {
  var newRule = dict.rules[oldName];
  dict.rules[newName] = newRule;
  delete dict.rules[oldName];
}

/*  */
function updateOcurrencesDigram(dict, digram) {
  updateOcurrencesOneChar(dict, 0, digram);
  updateOcurrencesOneChar(dict, 1, digram);  
}

/*  */
function updateOcurrencesOneChar(dict, i, digram) {
  var char = digram.charAt(i);
  if (char.match(new RegExp("[A-Z]"))) {
    Object.keys(dict.rules).forEach(function(key, index) {
		var rule = dict.rules[key];
		if (rule && rule.name == char) {
			rule.ocurrences--;
			if (rule.ocurrences == 1) {
				changeRule(dict, digram, digram.replace(char, key));
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