/**
 * 
 * 
 * @author      Steve Hoang <particles4dev>
 * @version     
 * @since       0.1
 *
**/


/**
 The property has 4 states that you can listen to:
	+) change :
	+) reset  :
	+) remove :
*/

(function(){
	/**
	 *
	 *
	 *
	 */
	Event = Create({
		// function will be run
		callback : null,
		// context execute callback function (this)
		content : null,
		// context's reference
		reference : null,

		/** 
		 * Constructor
		 * 
		 * @param callback
		 * @param content
		 * @param reference
		 *
		 * @return  
		**/
		_init : function(callback, content, reference){
			this.callback = callback;
			this.content = content;
			this.reference = reference;
		},
		/** 
		 * execute callback function
		 * 
		 * @param args 
		 *
		 * @return 
		**/	
		run : function( args ){
			if(this.reference != null){
				args.push(this.reference);
			}
			return this.callback.apply(this.content, args);
		}

	});
	/** 
	 * @static method
	 * 
	 * @param array : arguments[0] 
	 * @param args 	: arguments[n](0<n<arguments.length)
	 *
	 * @return 
	**/	
	Event.executeEvents = function(array){
		
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
			this._event =  new PrivateProperty(new ClassManager(false, true));

			if(!this._typeOfEvent) this._typeOfEvent = ['change', 'reset'];
			if(!this._ignorePrototype) this._ignorePrototype = ['_event', '_storeValue', '_super', '_typeOfEvent', '_ignorePrototype'];
			// object will store the old value of properties
			this._storeValue =  new PrivateProperty(new ClassManager(false, true));
		},

		_create: function(){
			/**
				
			*/			
			for(var prop in this) {
				if(typeof this[prop] != 'function' && this[prop] != this._event && this[prop] != this._storeValue && this[prop] != this._super && this[prop] != this._typeOfEvent ){
					this._storeValue.push([], prop);
					this._storeValue.get(prop).push(this[prop]);
					this.createNewEvent(prop);
				}
			}
			
		},

		/** 
		 * @description
		 * Create new event
		 * 
		 * @param name
		 *
		 * @return this
		**/
		createNewEvent: function(name){
			
			this._typeOfEvent.forEach(function(value, index){
				this._event.push([], value + ":" + name);
			}, this);
			
			return this;
		},

		/**
		 * GROUP METHOD VALUE
		 */
		// Previous the property's value
		previous: function( name ){
			
		},
		// Set function 
		set : function( obj ){
			for(var i in obj) {
				if (obj.hasOwnProperty(i)){
					var oldValue = this[i];
					if(!this._storeValue.has(i)){
						this._storeValue.push([], i);
						this.createNewEvent(i);
					}
					else
						this._storeValue.get(i).push(oldValue);
					this[i] = obj[i];
					Event.executeEvents(this._event.get('change:' + i), obj[i], oldValue);
				}
			}
			return this;
		},		
		/**
		 * @syntax : object.get(name)
		*/
		get : function( name ){
			return this[name];
		},
		/**
		 * @syntax : object.reset(name)
		*/
		reset : function( name ){
			var oldValue = this[name];
			this[name] = this._storeValue.get(name)[0];
			this._storeValue.set(name, []);
			this.triggerEvent('reset:' + name, this[name], oldValue);
			//Event.executeEvents(this._event.get('reset:' + name), this[name], oldValue);
			return this;
		},

		/**
		 * GROUP METHOD EVENT
		 */
		/**
		 * @syntax : object.trigger(event, [*args])
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
		triggerEvent: function(name){
			if(!name) return this;
			var args = [];
			args.push(this._event.get(name));
	        for (var i = 1, len = arguments.length; i < len; i++) {
	          	args.push(arguments[i]);
	        }

			Event.executeEvents.apply(Event.executeEvents, args);
			return this;
		},

		subscriber:  function(){},
		unsubscriber:  function(){},

		on: function(string, func, reference){
			if(!reference) reference = this;
			if(reference._event.get(string)){				
				reference._event.get(string).push(new Event(func, this, reference));
			}
		},
		off : function(){

		},
	});
})()
