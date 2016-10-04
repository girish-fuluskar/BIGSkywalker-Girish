angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  var location1;
  var location2;

  var address1;
  var address2;

  var latlng;
  var geocoder;
  var map;

  var distance;

  $scope.initialize = function(){
    fromLocation = $scope.From;
    toLocation = $scope.To;
    geocoder = new google.maps.Geocoder(); // creating a new geocode object

    // getting the two address values
    address1 = document.getElementById("address1").value;
    address2 = document.getElementById("address2").value;

    // finding out the coordinates
    if (geocoder)
    {
      geocoder.geocode( { 'address': address1}, function(results, status)
      {
        if (status == google.maps.GeocoderStatus.OK)
        {
          //location of first address (latitude + longitude)
          location1 = results[0].geometry.location;
          console.log("Location 1: " + location1);
        } else
        {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
      geocoder.geocode( { 'address': address2}, function(results, status)
      {
        if (status == google.maps.GeocoderStatus.OK)
        {
          //location of second address (latitude + longitude)
          location2 = results[0].geometry.location;
          console.log("Location 2: " + location2);
          // calling the showMap() function to create and show the map
          $scope.showMap();
        } else
        {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }    
  }

  // creates and shows the map
  $scope.showMap = function(){
    // center of the map (compute the mean value between the two locations)
    latlng = new google.maps.LatLng((location1.lat()+location2.lat())/2,(location1.lng()+location2.lng())/2);

    // set map options
      // set zoom level
      // set center
      // map type
    var mapOptions =
    {
      zoom: 1,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    // create a new map object
      // set the div id where it will be shown
      // set the map options
    map = new google.maps.Map(document.getElementById("map_canvas"));

    // show route between the points
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer(
    {
      suppressMarkers: true,
      suppressInfoWindows: true
    });
    directionsDisplay.setMap(map);
    var request = {
      origin:location1,
      destination:location2,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status)
    {
      if (status == google.maps.DirectionsStatus.OK)
      {
        directionsDisplay.setDirections(response);
        distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
        distance += "<br/>The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
        document.getElementById("distance_road").innerHTML = distance;
      }
    });

    // show a line between the two points
    var line = new google.maps.Polyline({
      map: map,
      path: [location1, location2],
      strokeWeight: 7,
      strokeOpacity: 0.8,
      strokeColor: "#FFAA00"
    });

    // create the markers for the two locations
    var marker1 = new google.maps.Marker({
      map: map,
      position: location1,
      title: "First location"
    });
    var marker2 = new google.maps.Marker({
      map: map,
      position: location2,
      title: "Second location"
    });

    // create the text to be shown in the infowindows
    var text1 = '<div id="content">'+
        '<h1 id="firstHeading">First location</h1>'+
        '<div id="bodyContent">'+
        '<p>Coordinates: '+location1+'</p>'+
        '<p>Address: '+address1+'</p>'+
        '</div>'+
        '</div>';

    var text2 = '<div id="content">'+
      '<h1 id="firstHeading">Second location</h1>'+
      '<div id="bodyContent">'+
      '<p>Coordinates: '+location2+'</p>'+
      '<p>Address: '+address2+'</p>'+
      '</div>'+
      '</div>';

    // create info boxes for the two markers
    var infowindow1 = new google.maps.InfoWindow({
      content: text1
    });
    var infowindow2 = new google.maps.InfoWindow({
      content: text2
    });

    // add action events so the info windows will be shown when the marker is clicked
    google.maps.event.addListener(marker1, 'click', function() {
      infowindow1.open(map,marker1);
    });
    google.maps.event.addListener(marker2, 'click', function() {
      infowindow2.open(map,marker1);
    });

    // compute distance between the two points
    var R = 6371;
    var dLat = $scope.toRad(location2.lat()-location1.lat());
    var dLon = $scope.toRad(location2.lng()-location1.lng());

    var dLat1 = $scope.toRad(location1.lat());
    var dLat2 = $scope.toRad(location2.lat());

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(dLat1) * Math.cos(dLat1) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    document.getElementById("distance_direct").innerHTML = "<br/>The distance between the two points (in a straight line) is: "+d;
  }

  $scope.toRad = function(deg){
    return deg * Math.PI/180;
  }
})

.controller('ChatsCtrl', function($scope, cloudantService, $q, $http, $interval) {
  //drone data from cloude database
  $scope.droneDataFromCloude = cloudantService.droneCloudeData()
    .then(function(droneDataSet){
      console.log(droneDataSet);
    },function(err){
        var alertPopup = $ionicPopup.alert({
        title: 'Search Failed!',
        template: 'There was some problem with server.'
      });
  });

  //Show map again
  var location1;
  var location2;

  var address1;
  var address2;

  var latlng;
  var geocoder;
  var map;

  var distance;

  /*$scope.loadMap = function(){

    //$scope.stream();
    geocoder = new google.maps.Geocoder(); // creating a new geocode object

      // getting the two address values
      address1 = "Mumbai, India";//document.getElementById("address1").value;
      address2 = "Pune, India";//document.getElementById("address2").value;

      // finding out the coordinates
      if (geocoder)
      {
        geocoder.geocode( { 'address': address1}, function(results, status)
        {
          if (status == google.maps.GeocoderStatus.OK)
          {
            //location of first address (latitude + longitude)
            location1 = results[0].geometry.location;
            console.log("Location 1: " + location1);
          } else
          {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
        geocoder.geocode( { 'address': address2}, function(results, status)
        {
          if (status == google.maps.GeocoderStatus.OK)
          {
            //location of second address (latitude + longitude)
            location2 = results[0].geometry.location;
            console.log("Location 2: " + location2);
            // calling the showMap() function to create and show the map
            $scope.showMap();
            $scope.gauge();
            $interval(function () {
                $scope.myfunction();
            }, 2000);
          } else
          {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
      }
    }*/
    $scope.loadMap = function(){
      $scope.gauge();

      var map;
      var directionDisplay;
      var directionsService;
      var stepDisplay;
      var markerArray = [];
      var position;
      var marker = null;
      var polyline = null;
      var poly2 = null;
      var speed = 0.000005,
          wait = 1;
      var infowindow = null;
      var timerHandle = null;

      $scope.createMarker=function(latlng, label, html) {
          var contentString = '<b>' + label + '</b><br>' + html;
          var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              title: label,
              zIndex: Math.round(latlng.lat() * -100000) << 5
          });
          marker.myname = label;
          google.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent(contentString);
              infowindow.open(map, marker);
          });
          return marker;
      }

      $scope.initialize=function() {
          infowindow = new google.maps.InfoWindow({
              size: new google.maps.Size(150, 50)
          });
          // Instantiate a directions service.
          directionsService = new google.maps.DirectionsService();

          // Create a map and center it on Manhattan.
          var myOptions = {
              zoom: 13,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          map = new google.maps.Map(document.getElementById("movingMap_canvas"), myOptions);

          var address = 'new york';
          geocoder = new google.maps.Geocoder();
          geocoder.geocode({
              'address': address
          }, function (results, status) {
              map.setCenter(results[0].geometry.location);
          });

          // Create a renderer for directions and bind it to the map.
          var rendererOptions = {
              map: map
          };
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

          // Instantiate an info window to hold step text.
          stepDisplay = new google.maps.InfoWindow();

          polyline = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 3
          });
          poly2 = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 3
          });
      }

      var steps = [];

        $scope.calcRoute=function() {

          if (timerHandle) {
              clearTimeout(timerHandle);
          }
          if (marker) {
              marker.setMap(null);
          }
          polyline.setMap(null);
          poly2.setMap(null);
          directionsDisplay.setMap(null);
          polyline = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 3
          });
          poly2 = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 3
          });
          // Create a renderer for directions and bind it to the map.
          var rendererOptions = {
              map: map
          };
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

          //var start = document.getElementById("start").value;
          //var end = document.getElementById("end").value;
          
          // getting the two address values
          var start = document.getElementById("address1").value;
          var end = document.getElementById("address2").value;
          var travelMode = google.maps.DirectionsTravelMode.DRIVING;

          var request = {
              origin: start,
              destination: end,
              travelMode: travelMode
          };

          // Route the directions and pass the response to a
          // function to create markers for each step.
          directionsService.route(request, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);

                  var bounds = new google.maps.LatLngBounds();
                  var route = response.routes[0];
                  startLocation = new Object();
                  endLocation = new Object();

                  // For each route, display summary information.
                  var path = response.routes[0].overview_path;
                  var legs = response.routes[0].legs;
                  for (i = 0; i < legs.length; i++) {
                      if (i === 0) {
                          startLocation.latlng = legs[i].start_location;
                          startLocation.address = legs[i].start_address;
                          //   marker = createMarker(legs[i].start_location, "start", legs[i].start_address, "green");
                      }
                      endLocation.latlng = legs[i].end_location;
                      endLocation.address = legs[i].end_address;
                      var steps = legs[i].steps;
                      for (j = 0; j < steps.length; j++) {
                          var nextSegment = steps[j].path;
                          for (k = 0; k < nextSegment.length; k++) {
                              polyline.getPath().push(nextSegment[k]);
                              bounds.extend(nextSegment[k]);
                          }
                      }
                  }
                  polyline.setMap(map);
                  map.fitBounds(bounds);
                  map.setZoom(18);
                  $scope.startAnimation();
              }
          });
      }



      var step = 50; // 5; // metres
      var tick = 100; // milliseconds
      var eol;
      var k = 0;
      var stepnum = 0;
      var speed = "";
      var lastVertex = 1;

      //=============== animation functions ======================
        $scope.updatePoly=function(d) {
          // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
          if (poly2.getPath().getLength() > 20) {
              poly2 = new google.maps.Polyline([polyline.getPath().getAt(lastVertex - 1)]);
              // map.addOverlay(poly2)
          }

          if (polyline.GetIndexAtDistance(d) < lastVertex + 2) {
              if (poly2.getPath().getLength() > 1) {
                  poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
              }
              poly2.getPath().insertAt(poly2.getPath().getLength(), polyline.GetPointAtDistance(d));
          } else {
              poly2.getPath().insertAt(poly2.getPath().getLength(), endLocation.latlng);
          }
      }

      $scope.animate=function(d) {
          if (d > eol) {
              map.panTo(endLocation.latlng);
              marker.setPosition(endLocation.latlng);
              return;
          }
          var p = polyline.GetPointAtDistance(d);
          map.panTo(p);
          var lastPosn = marker.getPosition();
          marker.setPosition(p);
          var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
          icon.rotation = heading;
          marker.setIcon(icon);
          $scope.updatePoly(d);
          timerHandle = setTimeout(function(){$scope.animate(d + step)}, tick);
      }

        $scope.startAnimation=function() {
          eol = polyline.Distance();
          map.setCenter(polyline.getPath().getAt(0));
          marker = new google.maps.Marker({
              position: polyline.getPath().getAt(0),
              map: map,
              icon: icon
          });

          poly2 = new google.maps.Polyline({
              path: [polyline.getPath().getAt(0)],
              strokeColor: "#0000FF",
              strokeWeight: 10
          });
          // map.addOverlay(poly2);
          setTimeout($scope.animate(50), 2000); // Allow time for the initial map display
      }
      google.maps.event.addDomListener(window, 'load', $scope.initialize());

      //=============== ~animation funcitons =====================

      var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
      var icon = {
          path: car,
          scale: .7,
          strokeColor: 'white',
          strokeWeight: .10,
          fillOpacity: 1,
          fillColor: '#404040',
          offset: '5%',
          // rotation: parseInt(heading[i]),
          anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
      };

      /*********************************************************************\
      *                                                                     *
      * epolys.js                                          by Mike Williams *
      * updated to API v3                                  by Larry Ross    *
      *                                                                     *
      * A Google Maps API Extension                                         *
      *                                                                     *
      * Adds various Methods to google.maps.Polygon and google.maps.Polyline *
      *                                                                     *
      * .Contains(latlng) returns true is the poly contains the specified   *
      *                   GLatLng                                           *
      *                                                                     *
      * .Area()           returns the approximate area of a poly that is    *
      *                   not self-intersecting                             *
      *                                                                     *
      * .Distance()       returns the length of the poly path               *
      *                                                                     *
      * .Bounds()         returns a GLatLngBounds that bounds the poly      *
      *                                                                     *
      * .GetPointAtDistance() returns a GLatLng at the specified distance   *
      *                   along the path.                                   *
      *                   The distance is specified in metres               *
      *                   Reurns null if the path is shorter than that      *
      *                                                                     *
      * .GetPointsAtDistance() returns an array of GLatLngs at the          *
      *                   specified interval along the path.                *
      *                   The distance is specified in metres               *
      *                                                                     *
      * .GetIndexAtDistance() returns the vertex number at the specified    *
      *                   distance along the path.                          *
      *                   The distance is specified in metres               *
      *                   Returns null if the path is shorter than that      *
      *                                                                     *
      * .Bearing(v1?,v2?) returns the bearing between two vertices          *
      *                   if v1 is null, returns bearing from first to last *
      *                   if v2 is null, returns bearing from v1 to next    *
      *                                                                     *
      *                                                                     *
      ***********************************************************************
      *                                                                     *
      *   This Javascript is provided by Mike Williams                      *
      *   Blackpool Community Church Javascript Team                        *
      *   http://www.blackpoolchurch.org/                                   *
      *   http://econym.org.uk/gmap/                                        *
      *                                                                     *
      *   This work is licenced under a Creative Commons Licence            *
      *   http://creativecommons.org/licenses/by/2.0/uk/                    *
      *                                                                     *
      ***********************************************************************
      *                                                                     *
      * Version 1.1       6-Jun-2007                                        *
      * Version 1.2       1-Jul-2007 - fix: Bounds was omitting vertex zero *
      *                                add: Bearing                         *
      * Version 1.3       28-Nov-2008  add: GetPointsAtDistance()           *
      * Version 1.4       12-Jan-2009  fix: GetPointsAtDistance()           *
      * Version 3.0       11-Aug-2010  update to v3                         *
      *                                                                     *
      \*********************************************************************/

      // === first support methods that don't (yet) exist in v3
      google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
          var EarthRadiusMeters = 6378137.0; // meters
          var lat1 = this.lat();
          var lon1 = this.lng();
          var lat2 = newLatLng.lat();
          var lon2 = newLatLng.lng();
          var dLat = (lat2 - lat1) * Math.PI / 180;
          var dLon = (lon2 - lon1) * Math.PI / 180;
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = EarthRadiusMeters * c;
          return d;
      }

      google.maps.LatLng.prototype.latRadians = function () {
          return this.lat() * Math.PI / 180;
      }

      google.maps.LatLng.prototype.lngRadians = function () {
          return this.lng() * Math.PI / 180;
      }

      // === A method which returns the length of a path in metres ===
      google.maps.Polygon.prototype.Distance = function () {
          var dist = 0;
          for (var i = 1; i < this.getPath().getLength(); i++) {
              dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
          }
          return dist;
      }

      // === A method which returns a GLatLng of a point a given distance along the path ===
      // === Returns null if the path is shorter than the specified distance ===
      google.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
          // some awkward special cases
          if (metres == 0) return this.getPath().getAt(0);
          if (metres < 0) return null;
          if (this.getPath().getLength() < 2) return null;
          var dist = 0;
          var olddist = 0;
          for (var i = 1;
          (i < this.getPath().getLength() && dist < metres); i++) {
              olddist = dist;
              dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
          }
          if (dist < metres) {
              return null;
          }
          var p1 = this.getPath().getAt(i - 2);
          var p2 = this.getPath().getAt(i - 1);
          var m = (metres - olddist) / (dist - olddist);
          return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
      }

      // === A method which returns an array of GLatLngs of points a given interval along the path ===
      google.maps.Polygon.prototype.GetPointsAtDistance = function (metres) {
          var next = metres;
          var points = [];
          // some awkward special cases
          if (metres <= 0) return points;
          var dist = 0;
          var olddist = 0;
          for (var i = 1;
          (i < this.getPath().getLength()); i++) {
              olddist = dist;
              dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
              while (dist > next) {
                  var p1 = this.getPath().getAt(i - 1);
                  var p2 = this.getPath().getAt(i);
                  var m = (next - olddist) / (dist - olddist);
                  points.push(new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m));
                  next += metres;
              }
          }
          return points;
      }

      // === A method which returns the Vertex number at a given distance along the path ===
      // === Returns null if the path is shorter than the specified distance ===
      google.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
          // some awkward special cases
          if (metres == 0) return this.getPath().getAt(0);
          if (metres < 0) return null;
          var dist = 0;
          var olddist = 0;
          for (var i = 1;
          (i < this.getPath().getLength() && dist < metres); i++) {
              olddist = dist;
              dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
          }
          if (dist < metres) {
              return null;
          }
          return i;
      }
      // === Copy all the above functions to GPolyline ===
      google.maps.Polyline.prototype.Distance = google.maps.Polygon.prototype.Distance;
      google.maps.Polyline.prototype.GetPointAtDistance = google.maps.Polygon.prototype.GetPointAtDistance;
      google.maps.Polyline.prototype.GetPointsAtDistance = google.maps.Polygon.prototype.GetPointsAtDistance;
      google.maps.Polyline.prototype.GetIndexAtDistance = google.maps.Polygon.prototype.GetIndexAtDistance;





      $interval(function () {
            $scope.myfunction();
        }, 2000);
    }


    /*LOAD IMAGES FROM DATABASE*/


    $scope.myfunction = function(){
       return $q(function(resolve, reject) {
                var req = {
                    url: 'https://aba4c519-beaf-45df-b86f-fc7f286212e8-bluemix.cloudant.com/nodered/_all_docs?limit=1&include_docs=true',
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic YWJhNGM1MTktYmVhZi00NWRmLWI4NmYtZmM3ZjI4NjIxMmU4LWJsdWVtaXg6OWUxNzg2NTI1ZmQ3YWExMzk4NzA2ZWJkYzgwNjZlNjVkZTAwMmU1NmJhM2E4MTEyZDM4N2RjNjIwYjE1OWFkMg==',
                        'Content-Type': 'image/png'
                    }
                }
                $http(req).then(function(data, err) {
                    if (data.data !== undefined) {
                        resolve(data.data["Success"]);
                        $scope._arrayBufferToBase64(/*data.data.payload.data*/ data.data.rows[0].doc.payload.data, $scope);
                    } else {
                        reject('S Failed!');
                    }
                    console.log(data);
                    var keys = Object.keys(data);
                    console.log(keys);
                }, function(err) {
                    reject(err);
                });
            });
    }

    $scope._arrayBufferToBase64= function( buffer ,$scope) {

        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        var pic = window.btoa( binary );
       $scope.data = pic;
    }

    /* LOAD IMAGES*/
    // creates and shows the map
  $scope.showMap = function(){
    // center of the map (compute the mean value between the two locations)
    latlng = new google.maps.LatLng((location1.lat()+location2.lat())/2,(location1.lng()+location2.lng())/2);

    // set map options
      // set zoom level
      // set center
      // map type
    var mapOptions =
    {
      zoom: 1,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    // create a new map object
      // set the div id where it will be shown
      // set the map options
    map = new google.maps.Map(document.getElementById("movingMap_canvas"));

    // show route between the points
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer(
    {
      suppressMarkers: true,
      suppressInfoWindows: true
    });
    directionsDisplay.setMap(map);
    var request = {
      origin:location1,
      destination:location2,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status)
    {
      if (status == google.maps.DirectionsStatus.OK)
      {
        directionsDisplay.setDirections(response);
        distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
        distance += "<br/>The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
        //document.getElementById("distance_road").innerHTML = distance;
      }
    });

    // show a line between the two points
    var line = new google.maps.Polyline({
      map: map,
      path: [location1, location2],
      strokeWeight: 7,
      strokeOpacity: 0.8,
      strokeColor: "#FFAA00"
    });

    // create the markers for the two locations
    var marker1 = new google.maps.Marker({
      map: map,
      position: location1,
      title: "First location"
    });
    var marker2 = new google.maps.Marker({
      map: map,
      position: location2,
      title: "Second location"
    });

    // create the text to be shown in the infowindows
    var text1 = '<div id="content">'+
        '<h1 id="firstHeading">First location</h1>'+
        '<div id="bodyContent">'+
        '<p>Coordinates: '+location1+'</p>'+
        '<p>Address: '+address1+'</p>'+
        '</div>'+
        '</div>';

    var text2 = '<div id="content">'+
      '<h1 id="firstHeading">Second location</h1>'+
      '<div id="bodyContent">'+
      '<p>Coordinates: '+location2+'</p>'+
      '<p>Address: '+address2+'</p>'+
      '</div>'+
      '</div>';

    // create info boxes for the two markers
    var infowindow1 = new google.maps.InfoWindow({
      content: text1
    });
    var infowindow2 = new google.maps.InfoWindow({
      content: text2
    });

    // add action events so the info windows will be shown when the marker is clicked
    google.maps.event.addListener(marker1, 'click', function() {
      infowindow1.open(map,marker1);
    });
    google.maps.event.addListener(marker2, 'click', function() {
      infowindow2.open(map,marker1);
    });

    // compute distance between the two points
    var R = 6371;
    var dLat = $scope.toRad(location2.lat()-location1.lat());
    var dLon = $scope.toRad(location2.lng()-location1.lng());

    var dLat1 = $scope.toRad(location1.lat());
    var dLat2 = $scope.toRad(location2.lat());

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(dLat1) * Math.cos(dLat1) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    //document.getElementById("distance_direct").innerHTML = "<br/>The distance between the two points (in a straight line) is: "+d;
  }

  $scope.toRad = function(deg){
    return deg * Math.PI/180;
  }
  

  $scope.gauge = function(){
    //Speedometer
    $(document).ready(function(){
      var chart = {      
        type: 'gauge',
        backgroundColor: 'rgba(0,0,0,0)',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      };
      var title = null;
      var pane = {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                      [0, '#FFF'],
                      [1, '#333']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                      [0, '#333'],
                      [1, '#FFF']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      };
      var tooltip = {
        enabled: false
      };

      // the value axis
      // the value axis
      var yAxis= {
            min: 0,
            max: 200,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'km/h'
            },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' // green
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D' // yellow
            }, {
                from: 160,
                to: 200,
                color: '#DF5353' // red
            }]
        };
      var credits = {
        enabled: false
      };

      var series= [{
          name: 'Speed',
          data: [80],
          tooltip: {
              valueSuffix: ' km/h'
          }
      }]

      var json = {};   
      json.chart = chart; 
      json.title = title;       
      json.pane = pane; 
      json.tooltip = tooltip; 
      json.yAxis = yAxis; 
      json.credits = credits; 
      json.series = series;     
      $('#container-speed').highcharts(json);


      var chartFunction = function() {
        // Speed
        var chart = $('#container-speed').highcharts();
        var point;
        var newVal;
        var inc;

        if (chart) {
           point = chart.series[0].points[0];
           inc = Math.round((Math.random() - 0.5) * 100);
           newVal = point.y + inc;

           if (newVal < 0 || newVal > 200) {
              newVal = point.y - inc;
           }
           point.update(newVal);
        }
      };
      // Bring life to the dials
      setInterval(chartFunction, 1500);
    });

    //RPM meter
    $(document).ready(function(){
      var chart = {      
        type: 'gauge',
        backgroundColor: 'rgba(0,0,0,0)',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      };
      var title = null;
      var pane = {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                      [0, '#FFF'],
                      [1, '#333']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                      [0, '#333'],
                      [1, '#FFF']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      };
      var tooltip = {
        enabled: false
      };

      // the value axis
      // the value axis
      var yAxis= {
            min: 0,
            max: 20,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'RPM<br>1000<br>revs/sec',
            },
            plotBands: [{
                from: 0,
                to: 6,
                color: '#55BF3B' // green
            }, {
                from: 6,
                to: 14,
                color: '#DDDF0D' // yellow
            }, {
                from: 14,
                to: 20,
                color: '#DF5353' // red
            }]
        };
      var credits = {
        enabled: false
      };

      var series= [{
          name: 'RPM',
          data: [20],
          tooltip: {
              valueSuffix: ' revolutions/sec'
          }
      }]

      var json = {};   
      json.chart = chart; 
      json.title = title;       
      json.pane = pane; 
      json.tooltip = tooltip; 
      json.yAxis = yAxis; 
      json.credits = credits; 
      json.series = series;     
      $('#container-rpm').highcharts(json);


      var chartFunction = function() {
        // Speed
        var chart = $('#container-rpm').highcharts();
        var point;
        var newVal;
        var inc;

        if (chart) {
           point = chart.series[0].points[0];
           inc = Math.round((Math.random() - 0.5)*10);
           newVal = point.y + inc;

           if (newVal < 0 || newVal > 20) {
              newVal = point.y - inc;
           }
           point.update(newVal);
        }
      };
      // Bring life to the dials
      setInterval(chartFunction, 1500);
    });

    //Battery Meter
    $(function () {
      $('#containerVolt').highcharts({
          chart: {
              type: 'gauge',
              backgroundColor: 'rgba(0,0,0,0)',
              plotBorderWidth: 1,
              plotBackgroundColor:{
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                      [0, '#FFF4C6'],
                      [0.3, '#FFFFFF'],
                      [1, '#FFF4C6']
                  ]
              },
              plotBackgroundImage: null,
              width:200,
              height: 100
          },
          title: {
              text: ''
          },
          pane: [{
              startAngle: -45,
              endAngle: 45,
              background: null,
              center: ['50%', '115%'],
              size: 100
          }],
          tooltip: {
              enabled: true
          },
          yAxis: [{
              min: 0,
              max: 100,
              minorTickPosition: 'outside',
              tickPosition: 'outside',
              labels: {
                  rotation: 'auto',
                  distance: 20
              },
              plotBands: [{
                  from: 0,
                  to: 6,
                  color: '#C02316',
                  innerRadius: '100%',
                  outerRadius: '105%'
              }],
              pane: 0,
              title: {
                  text: 'Battery<br/><span style="font-size:8px">Volts</span>',
                  y: -40
              }
          }],
          plotOptions: {
              gauge: {
                  dataLabels: {
                      enabled: true
                  },
                  dial: {
                      radius: '100%'
                  }
              }
          },

          series: [{
              name: 'Channel A',
              data: [0],
              yAxis: 0
          }]
      },
          // Let the music play
          function (chart) {
              setInterval(function () {
                  if (chart.series) { // the chart may be destroyed
                      var left = chart.series[0].points[0],
                          leftVal,
                         // rightVal,
                          inc = (Math.random() - 3) * 3;
                      leftVal = left.y + inc;
                      if (leftVal < 50 || leftVal > 70) {
                          leftVal = left.y - inc;
                      }
                      left.update(leftVal, false);
                      chart.redraw();
                  }
              }, 500);
          });
    });
  }

  /*//connect video database
  $scope.stream = function(){
    var cloudantConfig = {
      user : "2f5922e8-30f1-4afd-a3b5-45e076b9d948-bluemix",
      password : "f517ae3b84bc2ab3ea98b71ae7ec487678439df39da6e0f18dc2509a90f64d72"
    }

    // Initialize the library with my account.
    var cloudant = cloudantConfig;
    var droneDB = cloudant.db.use('drone');

    droneDB.list({'limit' : 1, 'descending' : true, 'include_docs' : true},function(err, body) {
      if (!err) {
        body.rows.forEach(function(doc) {
          var pict = Buffer(doc.doc.payload);
          res.append("Content-Type",'image/png');
          res.send(pict);
        });
      }
    });
  } */

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
