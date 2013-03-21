/**
 The property has 4 states that you can listen to:
	+) change :
	+) reset  :
	+) remove :
*/

(function(){

	Event = Create({
		// function will be run
		callback : null,
		// 
		content : null,
		// 
		reference : null,
		_init : function(callback, content, reference){
			this.callback = callback;
			this.content = content;
			this.reference = reference;
		},

		run : function( args ){
			if(this.reference != null){
				args.push(this.reference);
			}
			this.callback.apply(this.content, args);
		}

	});
	// static method
	Event.callEvents = function(array){
		
		var args = [];
	    for (var i = 1, len = arguments.length; i < len; i++) {
	        args.push(arguments[i]);
	    }
		for(var i = 0, len = array.length; i < len; i++){
			array[i].run(args);
		}

	}

	EventModel = Create({		

		_init: function(){
			// define the type of events
			this._event = {
				property:{
					change : ON,
					reset  : ON,
					remove : ON
				},
				class:{

				}
			};
			/**
				auto create get/set function to objects property
				Note:
					set<property's name> function will autorun <property's name>Change function if it exits
			*/
			for(var prop in this) {
				if(typeof this[prop] == 'number' || typeof this[prop] == 'string'){
					var self = this;
					(function(){
						var p = prop;
						var saveValue = self[p];

						self[p] = {};
						// object store listener
						self[p]["On"] = new ClassManager(true, true);
						self.addTypeOfEventsForProperty(self._event.property, p);

						self[p]["SaveValue"] = [];
						self[p]["SaveValue"].push(saveValue);
						self[p]['index'] = self[p]["SaveValue"].length;
						self[p]['push'] = function( newValue ){
							self[p]["SaveValue"].push(newValue);
							self[p]['index']++;
						}
						self[p]['pop'] = function(){							
							self[p]['index']--;
							return self[p]["SaveValue"].pop();
						}
						self[p]['value'] = function(){
							return self[p]["SaveValue"][self[p]['index']-1];
						}
						self[p]['reset'] = function(){
							self[p]['index'] = 1;
						}
						// create get function
						/**
						var g = "get" + p;
						self[g] = function(){
							return self[p];
						}
						*/

						//create set function
						/**
						var s = "set" + p;						
						self[s] = function(v){
							if(self[p] != v){
								var oldValue = self[p];
								self[p] = v;																
								Event.callEvents(self[p]["On"].get('change'), v, oldValue);
							}
							return this;
						}
						*/
						//create reset function
						/**
						var r = "reset" + p;
						self[r] = function(){
							if(self[p] != saveValue){
								var oldValue = self[p];
								self[p] = saveValue;
								Event.callEvents(self[p]["On"].get('reset'), saveValue, oldValue);
							}
							return this;
						}
						*/
					})();					
				}
			}
			// Event for class
			this["eventOn"] = new ClassManager(true, true);
			this.addTypeOfEventsForProperty(this._event.class, "event");
		},

		addTypeOfEventsForProperty: function(events, property){
			for(var i in events) {
				if (events.hasOwnProperty(i)){
					this.addTypeOfEventForProperty(i, property);
					if(!this._event[i])
					this._event[events[i]] = ON;
				}				
			}
			return this;
		},
		addTypeOfEventForProperty: function(event, property){
			if(this[property]["On"].get(event)) return this;			
			this[property]["On"].push([], event);			
			return this;
		},

		// add listenToChange event
		listenToChange: function(nameProperty, object, callback){
			object[nameProperty]["On"].get('change').push(new Event(callback, this, object));			
			return this;
		},

		// add listenToReset event
		listenToReset: function(nameProperty, object, callback){
			object[nameProperty]["On"].get('reset').push(new Event(callback, this, object));			
			return this;
		},
		/**

		syntax : object.trigger(event, [*args])

		*/
		trigger: function(name){
			if(!name) return this;
			var args = [];
	        for (var i = 1, len = arguments.length; i < len; i++) {
	          	args.push(arguments[i]);
	        }
	        if(typeof this[name] == 'undefined') return this;
			this[name].apply(this, args);
			return this;
		},

		subscriber:  function(){},

		unsubscriber:  function(){},
		//listenTo:
		//stopListening:
		on : function(string, func){

		},
		off : function(){},

		// create set function 
		set : function( obj ){
			for(var i in obj) {
				if (obj.hasOwnProperty(i)){
					var oldValue = this[i].value();
					this[i].push(obj[i]);
					Event.callEvents(this[i]["On"].get('change'), obj[i], oldValue);
				}
			}
			return this;
		},
		// create get function
		get : function( name ){
			return this[name].value();
		},
		// create reset function
		reset : function( name ){
			var oldValue = this[name].value();
			this[name].reset();
			Event.callEvents(this[name]["On"].get('reset'), this[name].value(), oldValue);
			return this;
		},

		previous: function( name ){
			this[name]['index']--;
			return this[name].value();
		}
	});
})()
