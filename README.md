Dotted Version Vector Sets
==========================

This is an implementation of the Erlang's [DVV](https://github.com/ricardobcl/Dotted-Version-Vectors) on Python.

It is used in distributed systems, where UTC timestamp is unreliable value for object's version control.

Usage examples
==============

* Creating a new version
```js
var dvvset = $.dvvset();
var modified_utc = (new Date()).getTime()/1000; // timestamp value is used for example only. It can be anything.
modified_utc = parseInt(modified_utc).toString();
var dot = dvvset.create(dvvset.new(modified_utc), "user_id_1")
```

* Incrementing version
```js
var context = dvvset.join(dot)
var modified_utc = (new Date()).getTime()/1000;
modified_utc = parseInt(modified_utc).toString();
var new_dot = dvvset.update(dvvset.new_with_history(context, modified_utc), dot, "user_id_2")
dvvset.sync([dot, new_dot])
```

* Detecting conflicts

Conflict is situation when two branches of the history exist.
It could happen when someone updates old version ( casual history ).

```js
var merged_history = dvvset.sync([OldVersion, NewVersion])
var values = dvvset.values(merged_history)
if(values.length > 1){
    alert("Conflict detected")
} else{
    console.log("Ok")
}
```

Example
=======
1. User 1 uploads file to the server, specifying version vector:

```js
var dvvset = $.dvvset();
var modified_utc = (new Date()).getTime()/1000;
modified_utc = parseInt(modified_utc).toString();
var dot = dvvset.create(dvvset.new(modified_utc), "user_id_1")
```

2. Server checks version on a subject of conflict. Then it
stores file with version information and provides it to User 2.

```js
var merged_history = dvvset.sync([ExistingVersion, UploadedVersion])
var values = dvvset.values(merged_history)
if(values.length > 1){
    return "409 Conflict"
} else {
    return "200 OK"  # Casual history is linear
}
```

3. User 2 downloads file, edits it and increments its version, before uploading back to server.

```js
var context = dvvset.join(dot)  // ``dot`` is a downloaded version
var modified_utc = (new Date()).getTime()/1000;
modified_utc = parseInt(modified_utc).toString();
var new_dot = dvvset.update(dvvset.new_with_history(context, modified_utc), dot, "user_id_2")
dvvset.sync([dot, new_dot])
```
