(function(){
	var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	/**
	 *	Every functions has _initializing property which allows object(a new instance of function) to run init function.
	 */	
	Function.prototype._initializing = false;
	Function.prototype._setInitializing = function(value){
		this._initializing = value;
		return this;
	}
	/**
	 *	Return the pattern function
	 */
	PatternFunction = function(){					
			var p = function(){
				// Clone this
				var self = this;			
				// Make protected, private propertype 
				for (prop in self) {
					if(self[prop] instanceof ProtectedProperty || self[prop] instanceof PrivateProperty)
					Object.addProperty(self, prop, self[prop]);
				}				
				// Run _init
				if ( !this.constructor._initializing && this._init )
					this._init.apply(this, arguments);					
			};			
			return p;		
	}
	/**
	 *  AccessDeniedError
	 *
	 *  The error will throw if you access protected or private property
	 *
	 */
	AccessDeniedError = function(){
		var name = "";
		var message = "Access Denied !!!";

		this.getMessage = function(){
			return name + " " + message;
		}
	}
	
	/**
	 *  ProtectedProperty Class
	 *
	 *
	**/
	ProtectedProperty = function(v){
		/** 
		 * Private property
		**/
		var self = this;
		var value = v;
		/** 
		 * Public property
		**/
		var ObjectParent = null;
		this.setObject = function(o){
			ObjectParent = o;    
		};
		this.enumerable = true;
		this.configurable = true;
		// Define the getter
		this.get = function get(){
			var c = Check(ObjectParent, get.caller);
			if(c == Extends.ISPROTECTED) return new ProtectedProperty(value);
			return value;
		};
		// Define the setter
		this.set = function set($value) {
			Check(ObjectParent, set.caller);
			value = $value;
		};  
	}
	PrivateProperty = function(v){
		/** 
		 * Private property
		**/
		var that = this;
		var value = v;
		/** 
		 * Public property
		**/
		var ObjectParent = null;
		this.setObject = function(o){
			ObjectParent = o;    
		};
		this.enumerable = false;
		this.configurable = true;
		// Define the getter
		this.get = function get(){
			Check(ObjectParent, get.caller);
			return value;
		};
		// Define the setter
		this.set = function set($value) {			
			Check(ObjectParent, set.caller);
			value = $value;
		};  
	};
	
	/**
	 *  
	 *
	 *  
	**/
	Check = function Check(object, caller){
		if (caller === Check) {
			return;
		}
		if (caller === Extends) {
			return Extends.ISPROTECTED;
		}
		if (caller) {
			for (var key in object) {
				//console.log(key);
				//console.log(object[key]);
				
				if (object[key] === caller){
					return;
				}
			}
			// If you use _super keyword
			for (var key in object) {				
				if (object[key] === caller.caller){
					return;
				}
			}
			// If you use _super keyword in _init function
			for (var key in object) {				
				if (object[key] === caller.caller.caller){
					return;
				}
			}
		}
		console.log(object);
		console.log(caller);
		throw new AccessDeniedError();
	};
	Create = function( target ){
		var f = PatternFunction();
		var result = new f();
		if(typeof target == 'function')
			target = new target();
		for(var prop in target) {	        	
	    	if (target.hasOwnProperty(prop)){
	    		if(typeof target[prop] == "function" && typeof result[prop] == "function" && fnTest.test(target[prop])){
		    			var tgFunc = (function(sourceFunc, targeFunc){
		    				return function(){
		    					var tmp = this._super;
		    					this._super = sourceFunc;	    				
		    					var ret = targeFunc.apply(this, arguments);
		    					this._super = tmp;
		    					return ret;
		    				}
		    			})(result[prop],target[prop]);
						result[prop] = tgFunc;	    						    			
		    		}	    		
		    	else{		    			
	    			result[prop] = target[prop];
	    		}
		    }	
	    }
	    f.prototype = result;
	    //get f is parent
		f.prototype.constructor = f;
		return f;
	};
	Extends = function(source, target){
		source._setInitializing(true);		
		var result = new source();
		source._setInitializing(false);
		var f = PatternFunction();
		if(typeof target == 'function')
			target = new target();
		for(var prop in target) {	        	
	    	if (target.hasOwnProperty(prop)){
	    		if(typeof target[prop] == "function" && typeof result[prop] == "function" && fnTest.test(target[prop])){
		    			var tgFunc = (function(sourceFunc, targeFunc){
		    				return function(){
		    					var tmp = this._super;
		    					this._super = sourceFunc;	    				
		    					var ret = targeFunc.apply(this, arguments);
		    					this._super = tmp;
		    					return ret;
		    				}
		    			})(result[prop],target[prop]);
						result[prop] = tgFunc;	    						    			
		    		}	    		
		    	else{		    			
	    			result[prop] = target[prop];
	    		}
		    }	
	    }

	    f.prototype = result;
	    //get f is parent
		f.prototype.constructor = f;
		return f;	
	};
	Extends.ISPROTECTED = 0;
	/**
	 *  
	 *
	 *  
	**/
	Object.addProperty = (function(defineProperty){		
		return function addProperty(object, key, description){       
			description.setObject(object);
			defineProperty(object, key, description);
		};
	}(Object.defineProperty));
})();
try{


console.group("Step 1 : Create object");
var PERSON = Create(function(){
	this.firstName = new ProtectedProperty('');
	this.lastName  = new ProtectedProperty('');
	this.money 	   = new PrivateProperty(300);
	this._init = function(firstName, lastName){
		this.firstName = firstName;
		this.lastName  = lastName;
	};
	this.information = function(){
		console.log('my name is ' + this.firstName + " " + this.lastName);
	};
	this.information2 = function(){
		this.information();
	};
})
var m = new PERSON('Steve', "Hoang");
m.information();
//add public property
m.getFirstName = function(){
	return this.firstName;
}
console.log(m.getFirstName());
console.log(m);
console.groupEnd();

console.group("Step 2 : Extends");
var AUS = Extends(PERSON, function(){
	this.sex = new PrivateProperty('male');
	this._init = function(firstName, lastName, sex){
		this._super(firstName, lastName);
		this.sex = sex;
	};
	this.information2 = function(){
		this._super();
		console.log('i am ' + this.sex);
	};
})
var z = new AUS('Steve', "Hoang", "male");
z.information2();
console.log(z);
console.groupEnd();
console.log(z instanceof PERSON);

} catch (e){
	console.log(e.getMessage());
}

