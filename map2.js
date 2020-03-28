var map;
var locations = [];


function initialiseMap() {

  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1B0TkgNxiD0Mn4KpEK3VB8rGuizEBlR_x0tKnfhxS8yY/values/Beren!A2:Q?key=AIzaSyDapnAfTmAxWjt56_vWZM9lLobV-V6y9HE", function(data) {
    	// data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    	// Modify the code below to suit the structure of your spreadsheet.
    	$(data.values).each(function() {
    		var location = {};
				location.title = this[0];

        if ((this[3] == '' || this[3] == 'Groesbeek') && this[2]) {
          var coordinates = this[2].split(",");
          location.latitude = parseFloat(coordinates[0]);
          location.longitude = parseFloat(coordinates[1]);
          //location.institution = this[3];
          //location.department = this[4];
          //location.funder = this[0];
          //location.url = this[13];
          locations.push(location);
        }
    	});

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(51.772437, 5.947937)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      setLocations(map, locations);
  });
}


function setLocations(map, locations) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });
  var titles = new Array();
  var aantalberen = 0;
  for (var i = 0; i < locations.length; i++) {
    var newTitle = titles[locations[i].latitude + '-' + locations[i].longitude];
    if (newTitle) {
      newTitle += ", " + locations[i].title;
      console.log(locations[i].latitude + '-' + locations[i].longitude + " ==> " + newTitle);
    } else {
      newTitle = locations[i].title;
    }
    titles[locations[i].latitude + '-' + locations[i].longitude] = newTitle;
    aantalberen ++;
  }

  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow, titles[locations[i].latitude + '-' + locations[i].longitude]);
    //bounds.extend(new_marker.position);
  }
  
  document.getElementById('aantalberen').innerHTML = "<i>Er staan op dit moment "+aantalberen +" beren op de kaart!</i>";
  //map.fitBounds(bounds);
}

function createMarker(map, location, infowindow, composedTitle) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: composedTitle,
    icon: 'https://pimkrebbers.github.io/berenjacht/Bear.png'
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div style="color: black;"><p><strong>' + composedTitle + '</strong></p></div>');
    infowindow.open(map, marker);
  });
  return marker;
}