QUnit.test( "Increment rule A > B", function(assert) {
  assert.equal(inrementRule("A"), "B");
});
QUnit.test( "Merge letters in array", function(assert) {
	var arr = ["a", "b"];
	replace2Elements(arr, 0, "A");
	assert.equal(arr[0], "A");
});