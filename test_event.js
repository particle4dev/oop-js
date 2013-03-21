(function(){
	/**
	specification:

	*/
	L.group("TEST EVENT MODEL");
	L.log('1. Create a class (Person) extend from EventModel class');
	var Person = Extends(EventModel, {
		firstName: 'Steve',
		lastName: 'Hoang'
	});
	L.log('2. New instance of Person (m1)');
	var m1= new Person();

	L.log("3. Listen to event firstName's change from m1");
	m1.listenToChange("firstName", m1, function(newValue, oldValue, content){
		alert(content.lastName + " change " + oldValue + " to "+ newValue + " in " + this.lastName);
	});

	L.log("4. New other instance of Person with the lastName is John");
	var m2 = new Person();
	m2.setlastName('John');

	L.log("5. Listen to event firstName's change from m2");
	m2.listenToChange("firstName", m1, function(newValue, oldValue, content){
		alert(content.lastName + " change " + oldValue + " to "+ newValue + " in " + this.lastName);
	});

	L.log("6. Change m1's firstName to Pearce");
	m1.setfirstName("Pearce");

	L.log("7. Add new event to m1 but it ready exits (it means doesn't do any thing)");
	m1.addTypeOfEventForProperty('remove', 'firstName');

	L.log("8. Listen to event firstName's reset from m2");
	m2.listenToReset("firstName", m1, function(newValue, oldValue, content){
		alert(content.lastName + " reset " + oldValue + " to "+ newValue + " in " + this.lastName);
	});

	L.log("9. Reset m1's firstName");
	m1.resetfirstName();

	L.groupEnd();
	/**
	var eventSplitter = /\s+/;
	var name = 'change  blue';
	if (eventSplitter.test(name)){
		var names = name.split(eventSplitter);
		console.log(names);
	}
	*/
})()