(function(){
	/**
	specification:

	*/
	L.group("TEST EVENT MODEL");
	L.log('1. Create a class (Person) extend from EventModel class');
	var Person = Extends(EventModel, {
		_init: function(){
			this.firstName = 'Steve';
			this.lastName = 'Hoang';
			this._super();
		}
	});
	L.log(Person);
	
	L.log('2. New instance of Person (m1)');
	var m1 = new Person();
	
	L.log("10. m1 is ");
	L.log(m1);

	
	L.log("3. Listen to event firstName's change from m1");
	m1.on("change:firstName", function(newValue, oldValue, content){
		alert(content.get('lastName') + " change " + oldValue + " to "+ newValue + " in " + this.get('lastName'));
	}, m1);
	
	L.log("4. New other instance of Person with the lastName is John");
	var m2 = new Person();
	m2.set({lastName : 'John'});

	L.log("5. Listen to event firstName's change from m2");
	m2.on("change:firstName", function(newValue, oldValue, content){
		alert(content.get('lastName') + " change " + oldValue + " to "+ newValue + " in " + this.get('lastName'));
	}, m1);

	L.log("6. Change m1's firstName to Pearce");
	m1.set({firstName : "Pearce"});	
	
	L.log("8. Listen to event firstName's reset from m2");
	m2.on("reset:firstName", function(newValue, oldValue, content){
		alert(content.get('lastName') + " change " + oldValue + " to "+ newValue + " in " + this.get('lastName'));
	}, m1);

	L.log("9. Reset m1's firstName");
	m1.reset('firstName');

	L.log("10. m1 is ");
	L.log(m1);
	/**
	L.log("7. Add new event to m1 but it ready exits (it means doesn't do any thing)");
	m1.addTypeOfEventForProperty('remove', 'firstName');
	*/
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
