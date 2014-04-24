$('#home').masonry({
  itemSelector: '.item'
});

 setTimeout(function(){
    $('.right').click(function(event){ 
    	$(this).parent().parent().parent().toggleClass('rotate-3d');  
    		$(".yelp").hide();
    	    var height = $(this).parent().parent().find(".content").height();
            var location = $(this).parent().parent().parent().find(".back").attr("data-location");
            var points = $(this).parent().parent().parent().find(".back").attr("data-location");
            $(this).find(".map").css("height",height);
            var title = $(this).parent().parent().parent().find("h2").html();
            var restaurant = $(this).find(".restaurant").html();
            var id = $(this).parent().parent().parent().find(".map").attr('id');
            $("#"+id).show();
            var review = $(this).parent().parent().parent().find(".back").find(".review");
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

 setTimeout(function(){
    $('.left').click(function(event){  
    	$(this).parent().parent().parent().toggleClass('rotate-3d');  
    	    $(this).addClass("clicked");
    		$(".yelp").show();
    	    var id = $(this).parent().parent().parent().find(".map").attr('id');
    	    $("#"+id).hide();
    	    var restaurant = $(this).parent().parent().parent().find(".restaurant").html();
    	    var points = $(this).parent().parent().parent().find(".back").attr("data-location");
    	    var review = $(this).parent().parent().parent().find(".back").find(".review");
    	    event.preventDefault();  
			$.ajax({
				url: "test.php",
				data: {location: points, name: restaurant},
				success: function(data){
				var too =  data;
				var tags = $.parseJSON(data);
				review.html(tags.businesses[0].snippet_text);
				},
			});
			})   
},3000);