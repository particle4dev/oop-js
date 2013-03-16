(function(){
	Event = Create({		
		_init: function(){
			for(var prop in this) {
				if(typeof this[prop] == 'number' || typeof this[prop] == 'string'){
					var self = this;
					(function(){
						var p = prop;
						var g = "get" + p;
						self[g] = function(){
							return self[p];
						}
						var s = "set" + p;
						self[s] = function(v){
							if(self[p] != v){
								var oldValue = self[p];
								self[p] = v;
								if(typeof self[p + "Change"] == "function")
									self[p + "Change"].call(self, oldValue);
							}
						}
					})();					
				}
			}
		},
		trigger: function(name){
			if(!name) return this;
			var args = [];
	        for (var i = 1, len = arguments.length; i < len; i++) {
	          	args.push(arguments[i]);
	        }
	        if(typeof this[name] == 'undefined') return this;
			this[name].apply(this, args);
			return this;
		}
	});
})()