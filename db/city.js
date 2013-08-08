$.ajax({
  url: "/city.json",
  dataType: "text",
  success: function(data){
    var x = data.split('\n');
    for(i=0;i<x.length;i++){
      var y = x[i].split('	');
      console.log('"'+i+'": "'+y[0]+'"');
    }
  }
});

$.ajax({
  url: "/cityjson.json",
  dataType: "json",
  success: function(data){
    
    console.log(data[55]);
  }
}).done(function(data){

});

$.ajax({
  url: "/city.json",
  dataType: "text",
  success: function(data){
    var x = data.split('\n');
    for(i=0;i<x.length;i++){
      var y = x[i].split('	');
      console.log('{"data": "'+i+'", "value": "' +y[0]+'"},');
    }
  }
});