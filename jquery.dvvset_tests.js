/*
* jquery.dvvset
*
* Dotted Version Vector Sets Unit Tests
*
*/


(function($){

$.dvvsetTests = function(options){
 var APITests = {
    dvvset: $.dvvset(),
    test_join: function(){
	var A = APITests.dvvset.new_dvv("v1");
	var A1 = APITests.dvvset.create(A, "a");

	var B = APITests.dvvset.new_with_history(APITests.dvvset.join(A1), "v2");
	var B1 = APITests.dvvset.update(B, A1, "b");

	var result1 = APITests.dvvset.join(A);
	if(result1.length != 0) return "new_dvv error";

	var result2 = APITests.dvvset.join(A1);
	if(JSON.stringify(result2) != '[["a",1]]') return "create error";

	var result3 = APITests.dvvset.join(B1);
	if(JSON.stringify(result3) != '[["a",1],["b",1]]') return "update error";
	return "OK";
    },
    test_update: function(){
	var A0 = APITests.dvvset.create(APITests.dvvset.new_dvv("v1"), "a");
	var A1 = APITests.dvvset.update(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A0), ["v2"]), A0, "a");
	var A2 = APITests.dvvset.update(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A1), ["v3"]), A1, "b");
	var A3 = APITests.dvvset.update(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A0), ["v4"]), A1, "b");
	var A4 = APITests.dvvset.update(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A0), ["v5"]), A1, "a");

	if(JSON.stringify(A0) != '[[["a",1,["v1"]]],[]]') return "create error";
	if(JSON.stringify(A1) != '[[["a",2,["v2"]]],[]]') return "update error 1";
	if(JSON.stringify(A2) != '[[["a",2,[]],["b",1,["v3"]]],[]]') return "update error 2";
	if(JSON.stringify(A3) != '[[["a",2,["v2"]],["b",1,["v4"]]],[]]') return "update error 3";
	if(JSON.stringify(A4) != '[[["a",3,["v5","v2"]]],[]]') return "update error 4";
	return "OK";
    },
    test_sync: function(){
	var X = [[["x",1,[]]],[]];
	var A = APITests.dvvset.create(APITests.dvvset.new_dvv("v1"), "a");
	var Y = APITests.dvvset.create(APITests.dvvset.new_list(["v2"]), "b");
	var A1 = APITests.dvvset.create(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A), ["v2"]), "a");
	var A3 = APITests.dvvset.create(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A1), ["v3"]), "b");
	var A4 = APITests.dvvset.create(APITests.dvvset.new_list_with_history(APITests.dvvset.join(A1), ["v3"]), "c");

	var W = [[["a",1,[]]],[]];
	var Z = [[["a",2,["v2","v1"]]],[]];

	var result1 = APITests.dvvset.sync([W, Z]);
	if(JSON.stringify(result1) != '[[["a",2,["v2"]]],[]]') return "sync error 1";

	var result2 = APITests.dvvset.sync([Z, W]);
	if(JSON.stringify(result1) != JSON.stringify(result2)) return "sync error 2";
	
	result1 = APITests.dvvset.sync([A, A1]);
	result2 = APITests.dvvset.sync([A1, A]);
	if(JSON.stringify(result1) != JSON.stringify(result2)) return "sync error 3";

	result1 = APITests.dvvset.sync([A4, A3]);
	result2 = APITests.dvvset.sync([A3, A4]);
	if(JSON.stringify(result1) != JSON.stringify(result2)) return "sync error 4";


	if(JSON.stringify(result1) != '[[["a",2,[]],["b",1,["v3"]],["c",1,["v3"]]],[]]') return "sync error 5";

	result1 = APITests.dvvset.sync([X, A]);
	result2 = APITests.dvvset.sync([A, X]);
	if(JSON.stringify(result1) != '[[["a",1,["v1"]],["x",1,[]]],[]]') return "sync error 6";
	if(JSON.stringify(result1) != JSON.stringify(result2)) return "sync error 7";

	result1 = APITests.dvvset.sync([A, Y]);
	result2 = APITests.dvvset.sync([Y, A]);
	if(JSON.stringify(result1) != '[[["a",1,["v1"]],["b",1,["v2"]]],[]]') return "sync error 8";
	if(JSON.stringify(result1) != JSON.stringify(result2)) return "sync error 9";

	return "OK";
    },
    test_sync_update: function(){
	// Mary writes v1 w/o VV
	var A0 = APITests.dvvset.create(APITests.dvvset.new_list(["v1"]), "a");
	// Peter reads v1 with version vector (VV)
	var VV1 = APITests.dvvset.join(A0);
	// Mary writes v2 w/o VV
	A1 = APITests.dvvset.update(APITests.dvvset.new_list(["v2"]), A0, "a");
	// Peter writes v3 with VV from v1
	A2 = APITests.dvvset.update(APITests.dvvset.new_list_with_history(VV1, ["v3"]), A1, "a");

	if(JSON.stringify(VV1) != '[["a",1]]') return "sync_update error 1";
	if(JSON.stringify(A0) != '[[["a",1,["v1"]]],[]]') return "sync_update error 2";
	if(JSON.stringify(A1) != '[[["a",2,["v2","v1"]]],[]]') return "sync_update error 3";
	// now A2 should only have v2 and v3, since v3 was causally newer than v1
	if(JSON.stringify(A2) != '[[["a",3,["v3","v2"]]],[]]') return "sync_update error 4";
	return "OK";
    },
    test_event: function(){
	var A = APITests.dvvset.create(APITests.dvvset.new_dvv("v1"), "a");
	A = A[0];
	var result1 = APITests.dvvset.event(A, "a", "v2");
	if(JSON.stringify(result1) != '[["a",2,["v2","v1"]]]') return "event error 1";
	result1 =  APITests.dvvset.event(A, "b", "v2");
	if(JSON.stringify(result1) != '[["a",1,["v1"]],["b",1,["v2"]]]') return "event error 2";
	return "OK";
    },
    test_less: function(){
	return "OK"; // TODO
    },
    test_equal: function(){
	return "OK"; // TODO
    },
    test_size: function(){
	return "OK"; // TODO
    },
    test_values: function(){
	return "OK"; // TODO
    },
    test_ids_values: function(){
	return "OK"; // TODO
    },
    main: function(){
	var div = $('div#results');
	var result = APITests.test_join();
	div.append("join: "+result+"<br/>");

	result = APITests.test_update();
	div.append("update: "+result+"<br/>");
	result = APITests.test_sync();
	div.append("sync: "+result+"<br/>");
	result = APITests.test_sync_update();
	div.append("sync_update: "+result+"<br/>");
	result = APITests.test_event();
	div.append("event: "+result+"<br/>");
	result = APITests.test_less();
	div.append("less: "+result+"<br/>");
	result = APITests.test_equal();
	div.append("equal: "+result+"<br/>");
	result = APITests.test_size();
	div.append("size: "+result+"<br/>");
	result = APITests.test_values();
	div.append("values: "+result+"<br/>");
	result = APITests.test_ids_values();
	div.append("ids_values: "+result+"<br/>");
    }
 };
 return {
    main: APITests.main
 };
};
})(jQuery);
