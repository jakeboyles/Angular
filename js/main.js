$('#home').masonry({
  itemSelector: '.item'
});


	


 setTimeout(function(){
    $('.food').click(function(event){  
    	    var height = $(this).find(".content").height();
            $(this).toggleClass('rotate-3d'); 
            var location = $(this).find(".back").attr("data-location");
            $(this).find(".map").css("height",height);
            var title = $(this).find("h2").html();
            var restaurant = $(this).find(".restaurant").html();
            var id = $(this).find(".map").attr('id');
            location = location.split(","); 
            event.preventDefault();  
            var map = L.mapbox.map(id, 'examples.map-9ijuk24y')
    		.setView([location[0],location[1]], 16);

		    L.mapbox.featureLayer({
		    type: 'Feature',
		    geometry: {
		        type: 'Point',
		        // coordinates here are in longitude, latitude order because
		        // x, y is the standard for GeoJSON and many formats
		        coordinates: [location[1],location[0]]
		    },
		    properties: {
		        title: title,
		        description: restaurant,
		        // one can customize markers by adding simplestyle properties
		        // http://mapbox.com/developers/simplestyle/
		        'marker-size': 'medium',
		        'marker-color': '#37393F'
		    }
			}).addTo(map);
	});    
},3000);