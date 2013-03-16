/**
 *	Name		: Interface.js
 *	Description	: 
 *	Licenses 	: 
 *	Authors 	: The Particles4dev Team.
 *	Inspiration	: 
 *	Provides	: [Interface]
 *  Status		: [Phien ban on dinh]
 *--------------------------------------------------------------------------*/
 /**
   *  
   *  <p>
   *  
   *
   *
   *
   *
   *   
   *  
   *  Example
   *
   *  	var inf = new Interface('inf',['i1', 'i2', 'i3']);
   *	var obj = {
   *	  	i1: function(){},
   *	  	i2: function(){},
   *	 	i3: function(){}
   *	}
   *	console.log(inf);
   *	console.log(Interface.ensureImplements(obj, inf));
  **/
(function(){
	
	Interface = function(name, methods) {
		if(arguments.length != 2) {
			throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
		}
		this.name = name;
		this.methods = [];
		for(var i = 0, len = methods.length; i < len; i++) {
			if(typeof methods[i] !== 'string') {
				throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
			}
			this.methods.push(methods[i]);
		}
	};
	// Static class method.
	Interface.ensureImplements = function(object) {
		if(arguments.length < 2) {
			throw new Error("Function NTERFACE.ensureImplements called with " +
			arguments.length + "arguments, but expected at least 2.");
		}
		for(var i = 1, len = arguments.length; i < len; i++) {
			var Interface = arguments[i];
			if(Interface.constructor !== Interface) {
				throw new Error("Function Interface.ensureImplements expects arguments" + "two and above to be instances of Interface.");
			}
			for(var j = 0, methodsLen = Interface.methods.length; j < methodsLen; j++) {
				var method = Interface.methods[j];
				if(!object[method] || typeof object[method] !== 'function') {
					throw new Error("Function Interface.ensureImplements: object "
					+ "does not implement the " + Interface.name
					+ " Interface. Method " + method + " was not found.");
				}
			}
		}
	};

})();	
