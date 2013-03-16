(function(){
	var Person = Extends(Event, {
		firstName: 'Steve',
		lastName: 'Hoang',
		firstNameChange: function( old ){
			console.log('firstName Change ' + old + " to " + this.firstName);
		}
	});
	var m = new Person();
	console.log(m);
	m.setfirstName("Pearce");	
	console.log(m.getfirstName());

	m.alert = function(msg) {
  		alert("Triggered " + msg);
	}
	m.trigger('alert');

	var eventSplitter = /\s+/;
	var name = 'change  blue';
	if (eventSplitter.test(name)){
		var names = name.split(eventSplitter);
		console.log(names);
	}
	
})()