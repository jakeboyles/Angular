$('#home').masonry({
  itemSelector: '.item'
});


	


 setTimeout(function(){

        $('.food').click(function(event){  
            $(this).toggleClass('rotate-3d');  
            event.preventDefault();  
            var location = $(this).find('.back').attr('data-location');
            alert(location);


		function initialize() {
	        var mapOptions = {
	          center: new google.maps.LatLng(-34.397, 150.644),
	          zoom: 8
	        };
        	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      	}
      	google.maps.event.addDomListener(window, 'load', initialize);

        });    
 },9000);