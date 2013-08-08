var yamapCity = $(".city_for_map"),
    yamapStreet = $(".street_for_map"),
    yamapBuilding = $(".house_for_map");
var map = null;
var placemark = null;
var map_created = false;

var yamaps = {
  mapInit: function(){

    ymaps.ready(function(){
      
      if(map_created) return;
        map_created = true;
        map = new ymaps.Map('yamap', {
          center: [50.76, 40.64],
          zoom: 12
        });
        map.controls.add('smallZoomControl', { top: 5, left: 5 });
        yamapCity.add(yamapStreet).add(yamapBuilding).keypress(function(){
          yamaps.mapUpdate();
        });
        yamapCity.add(yamapStreet).add(yamapBuilding).change(function(){
          yamaps.mapUpdate();
        });
    });
  },
  mapUpdate: function(){
    var zoom = 12;
    var address = '';

    var cityVal = $.trim(yamapCity.val());
    if(cityVal){
        if(address) address += ', ';
        address += cityVal;
        zoom = 10;
    }

    var streetVal = $.trim(yamapStreet.val());
    if(streetVal){
        if(address) address += ', ';
        address += streetVal;
        zoom = 13;
    }

    var buildingVal = $.trim(yamapBuilding.val());
    if(buildingVal){
        if(address) address += ', ';
        address += buildingVal;
        zoom = 16;
    }

    if(address && map_created){
      $('#yamap').show();
      var geocode = ymaps.geocode(address);
      geocode.then(function(res){
        map.geoObjects.each(function (geoObject) {
          map.geoObjects.remove(geoObject);
        });
        
        var position = res.geoObjects.get(0).geometry.getCoordinates();
        console.log(position);
        placemark = new ymaps.Placemark(position, {}, {});
        //http://api.yandex.ru/maps/jsbox/button_layout
        map.geoObjects.add(placemark);
        map.setCenter(position, zoom);
      });
    }
  }
}



//     $(function() {
//         var token = '51fa49542fb2b4206b000004';
//         var key = '48b344a5f1002c6ef5354c9eda3a4a0ff58f2bbc';        
        
//         var city = $( '[name="city"]' );
//         var street = $( '[name="address"]' );
//         var building = $( '[name="building"]' );
//         var buildingAdd = $( '[name="building-add"]' );


//         var Label = function( obj, query ){
//             var label = '';

//             if(obj.name){
//                 if(obj.typeShort){
//                     label += '<span class="ac-s2">' + obj.typeShort + '. ' + '</span>';
//                 }

//                 if(query.length < obj.name.length){
//                     label += '<span class="ac-s">' + obj.name.substr(0, query.length) + '</span>';
//                     label += '<span class="ac-s2">' + obj.name.substr(query.length, obj.name.length - query.length) + '</span>';
//                 } else {
//                     label += '<span class="ac-s">' + obj.name + '</span>';
//                 }
//             }

//             if(obj.parents){
//                 for(var k = obj.parents.length-1; k>-1; k--){
//                     var parent = obj.parents[k];
//                     if(parent.name){
//                         if(label) label += '<span class="ac-st">, </span>';
//                         label += '<span class="ac-st">' + parent.name + ' ' + parent.typeShort + '.</span>';
//                     }
//                 }
//             }

//             return label;
//         };

//         var 

//         city.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.CITY,
//             withParents: true,
//             label: Label,
//             filter: function(array, term){
//               var newArr = [];
//               for(i=0;i<array.length;i++){
//                 if(array[i].typeShort == "г"){
//                   newArr.push(array[i]);
//                 }
//               }
//               return newArr;
//             },
//             select: function( event, ui ) {
//                 city.data( "kladr-obj", ui.item.obj );
//                 // city.parent().find( 'label' ).text( ui.item.obj.type );
//                 street.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 MapUpdate();
//                 $('#ec_cityid').val(ui.item.obj.id);
//             }
//         });

//         street.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.STREET,
//             label: Label,
//             select: function( event, ui ) {
//                 street.data( "kladr-obj", ui.item.obj );
//                 // street.parent().find( 'label' ).text( ui.item.obj.type );
//                 building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 MapUpdate();
//             }
//         });

//         building.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.BUILDING,
//             label: Label,
//             select: function( event, ui ) {
//                 building.data( "kladr-obj", ui.item.obj );
//                 MapUpdate();
//             }
//         });

//         city.add(street).add(building).add(buildingAdd).change(function(){
//             MapUpdate();
//         });

//         ymaps.ready(function(){
//             if(map_created) return;
//             map_created = true;

//             map = new ymaps.Map('map', {
//                 center: [55.76, 37.64],
//                 zoom: 12
//             });

//             map.controls.add('smallZoomControl', { top: 5, left: 5 });
//         });
//     });
// })(jQuery);