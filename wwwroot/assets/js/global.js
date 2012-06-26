/*
 * POODLE - Flickr Gallery Global JS
 * @version 1.0
 * @author Team Poodle
 * @requires jQuery Core 1.7.2 - http://www.jquery.com/
*/

var FLICKR = window.FLICKR || {};

FLICKR.imageContainer = '#flickr-gallery';
FLICKR.imageCount = 0;
FLICKR.getImages = (function(){

	var requestPhotos = function(){
		var API_KEY = '3d979b1c03c5752ff713cb9446f74410',
			GROUP_ID = '62496320%40N00',
			photoSetURL,
			showOnPage = 18,
			photoString = '';
        
        var photoSetURL = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key='
        					+ API_KEY + '&group_id=' + GROUP_ID +'&per_page=' + showOnPage + '&format=json&jsoncallback=?';
		
		$.ajax({
			url: photoSetURL,
			dataType: 'jsonp',
			success: function(data){
				$.each(data.photos.photo, function(i, rPhoto){
					var basePhotoURL = 'http://farm' + rPhoto.farm + '.static.flickr.com/' + rPhoto.server + '/' + rPhoto.id + '_' + rPhoto.secret,  
						thumbPhotoURL = basePhotoURL + '_n.jpg',
						mediumPhotoURL = basePhotoURL + '.jpg';

					FLICKR.imageCount = FLICKR.imageCount + 1;
					photoString = photoString + '<a ' + 'title="' + rPhoto.title + '" href="'+ mediumPhotoURL +'"><img id="flickr-img-' + FLICKR.imageCount + '" src="' + thumbPhotoURL + '" alt="' + rPhoto.title + '"/></a>';           
				});
				 
				$(photoString).appendTo(FLICKR.imageContainer);
				//FLICKR.montage.init();
				//FLICKR.addFilter.init();
				FLICKR.detectfaces.init();
			}
		});
	};

	return{
		init: function(){
			requestPhotos();
		}
	};

}());

FLICKR.addFilter = (function(){

	var bindFliterListener = function(){
	
		var image = Caman("#flickr-img-5", function () {});
		
		function render(filter) {
			
			image.revert(function () {
				image[filter]().render();
			});
		};
			
		$('#filter-selection a').on('click', function(e){			
			e.preventDefault();
			
			var filter = $(this).attr('class');
			render(filter);
		});
		
	};
	
	return{
		init: function(){
			Caman.remoteProxy = '../proxies/caman_proxy.php';
			bindFliterListener();
		}
	}
})();

FLICKR.detectfaces = (function(){
	
	var getFaceCoordinates = function() {
	
		var coords = $('#flickr-img-9').faceDetection({
			error: function(img, code, message){
				console.log(message);
			},
			complete: function(img, coords){
				console.log(coords);
			}
		});
		
		for (var i = 0; i < coords.length; i++) {
			$('<div>', {
				'class':'face',
				'css': {
					'position':	'absolute',
					'left':		coords[i].positionX +5+'px',
					'top':		coords[i].positionY +5+'px',
					'width': 	coords[i].width		+'px',
					'height': 	coords[i].height	+'px'
				}
			})
			.appendTo('.container');
		}
		
		console.log(coords);
		
	}
	
	return {
		init: function(){
			getFaceCoordinates();
		}
	}
	
})();

FLICKR.montage = (function(){
	
 	createMontage = function() {
 	
 		var $container 	= $(FLICKR.imageContainer),
 			$imgs		= $container.find('img').hide(),
 			totalImgs	= $imgs.length,
 			coords		= '',
 			cnt			= 0;

 		$imgs.each(function(i) {
 			var $img	= $(this);
 			$('<img/>').load(function() {
 				++cnt;
 				if( cnt === totalImgs ) {
 					$imgs.show();
 					$container.montage({
 						liquid 	: true,
 						fillLastRow : false,
 						margin: 2,
 						minw : 100,
 						alternateHeight	: true,
 						alternateHeightRange : {
 							min	: 100,
 							max	: 240
 						}
 					});
 				}
 			}).attr('src',$img.attr('src'));
 		});
 	}
	
 	return {
 		init: function(){
	 		createMontage();
 		}
 	}

})();

$(document).ready(function(){
	FLICKR.getImages.init();
});