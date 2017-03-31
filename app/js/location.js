var map;
var infoWindow;

var SelectFilms=[
{name:"SelectFilms Store", desc:"SelectFilms Huddersfield",latitude:53.645728,longitude:-1.778890199999978},
{name:"SelectFilms Store", desc:"SelectFilms Leeds",latitude:53.79879,longitude:-1.5438199999999824},
{name:"SelectFilms Store", desc:"SelectFilms Bradford",latitude:53.794689,longitude:-1.748938599999974}
]

function geoLocate(position) {
    var lat=position.coords.latitude;
    var lon=position.coords.longitude;
    latlng= new google.maps.LatLng(lat,lon);
    startMapping(latlng);
}
function init(){
    navigator.geolocation.getCurrentPosition(geoLocate, geoError);
}
function geoError(error) {
    alert('There is an error'+error);
}
function startMapping(latlng) {
    var myOptions = {zoom: 10, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById("map"), myOptions);
var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:"Title"
     });
infoWindow = new google.maps.InfoWindow(
      {
        content:"Infowindow "
      });

      google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map,marker);
      });
var latlngbounds = new google.maps.LatLngBounds();
 for(var i=0;i<SelectFilms.length;i++){
        var ta_latlng=new google.maps.LatLng(SelectFilms[i].latitude,SelectFilms[i].longitude);
        var marker = new google.maps.Marker({position:ta_latlng,map:map,title:SelectFilms[i].name});
       var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, ta_latlng);
       SelectFilms[i].desc += "\n"+(distance/1600).toFixed(3)+" Miles Away";
        google.maps.event.addListener(marker, 'click', setUpMarker(marker,SelectFilms[i].desc))
       latlngbounds.extend(ta_latlng);
    }
map.setCenter(latlngbounds.getCenter());
map.fitBounds(latlngbounds);
}
function setUpMarker(marker,data)
{
  return function() 
  {
    infoWindow.setContent(data)
    infoWindow.open(map,marker);   
  };
}
window.addEventListener('load', init, false);