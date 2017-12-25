QUnit.test( "Increment rule A > B", function(assert) {
  assert.equal(inrementRule("A"), "B");
});

QUnit.test( "Merge letters in array", function(assert) {
	var arr = ["a", "b"];
	replace2Elements(arr, 0, "A");
	assert.equal(arr[0], "A");
	assert.equal(arr[0], "A");
});

QUnit.test( "abab - simple rule.", function(assert) {
	var dict = sequitur("abab");
	var expectedDict = {
		"currentRule": "B",
		"rules": {
			"ab": {
				"name": "A",
				"ocurrences": 2
			}
		},
	  "s": "AA"
	};
	assert.deepEqual(dict, expectedDict);
});

QUnit.test( "abcdbcabcdbc.", function(assert) {
	var dict = sequitur("abcdbcabcdbc");
	var expectedDict = {
		"currentRule": "E",
		"rules": {
			"bc": {
				"name": "A",
				"ocurrences": 2
			},
			"aAdA": {
				"name": "D",
				"ocurrences": 2
			}
		},
		"s": "DD"
	};
	assert.deepEqual(dict, expectedDict);
});

QUnit.test( "abcdbcabcd.", function(assert) {
	var dict = sequitur("abcdbcabcd");
	var expectedDict = {
		"currentRule": "D",
		"rules": {
			"bc": {
				"name": "A",
				"ocurrences": 2
			},
			"aAd": {
				"name": "C",
				"ocurrences": 2
			}
		},
		"s": "CAC"
	};
	assert.deepEqual(dict, expectedDict);
});

QUnit.test( "aabaaab - same letter repeating 3 times.", function(assert) {
	var dict = sequitur("aabaaab");
	var expectedDict = {
		"currentRule": "B",
		"rules": {
			"aa": {
				"name": "A",
				"ocurrences": 2
			}
		},
	  "s": "AbAab"
	};
	assert.deepEqual(dict, expectedDict);
});

QUnit.test( "abcabcab - same digram in s and in one of the rules, creates a rule that changes an existing rule.", function(assert) {
	var dict = sequitur("abcabcab");
	var expectedDict = {
		"currentRule": "D",
		"rules": {
			"Cc": {
				"name": "B",
				"ocurrences": 2
			},
			"ab": {
				"name": "C",
				"ocurrences": 2
			}
		},
	  "s": "BBC"
	};
	assert.deepEqual(dict, expectedDict);
});