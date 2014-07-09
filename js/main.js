$('#home').masonry({
  itemSelector: '.item'
});

 setTimeout(function(){
    $('.food').click(function(event){  
    	if(!$(this).hasClass("clicked")) {
    		$(this).find(".front").hide();
    	    var height = $(this).find(".content").height();
            $(this).toggleClass('rotate-3d');
            $(this).toggleClass("clicked"); 
            var location = $(this).find(".back").attr("data-location");
            var points = $(this).find(".back").attr("data-location");
            $(this).find(".map").css("height",height);
            var title = $(this).find("h2").html();
            var restaurant = $(this).find(".restaurant").html();
            var id = $(this).find(".map").attr('id');
            var review = $(this).find(".back").find(".review");
            location = location.split(","); 
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

			} else {
			$(this).toggleClass('rotate-3d'); 
			$(this).toggleClass("clicked");
			$(this).find(".front").show();
			}
	});    
},3000);