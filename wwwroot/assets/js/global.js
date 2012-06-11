/*
 * POODLE - Flickr Gallery Global JS
 * @version 1.0
 * @author Team Poodle
 * @requires jQuery Core 1.7.2 - http://www.jquery.com/
*/

var FLICKR = window.FLICKR || {};

FLICKR.getImages = (function(){

	var photoSetURL = 'http://api.flickr.com/services/feeds/groups_pool.gne?id=83376903@N00&format=json&jsoncallback=?';
	
	var createImgDomNode = function(imageUrl){
		var imageNode = '<img src="' + imageUrl + '" id="image'+ i +'"/>';
		$('#image-gallery').append(imageNode, i);
	};

	var requestPhotos = function(){
		$.ajax({
			url: photoSetURL,
			dataType: 'jsonp',
			success: function(data){

				var photoArr = data.items;

				for (i in photoArr){
					createImgDomNode(data.items[i].media.m, i);
				}

			}
		});
	};

	return{
		init: function(){
			//requestPhotos();
			FLICKR.addFilter.init();
		}
	};

}());

FLICKR.addFilter = (function(){
	
	var bindFliterListener = function(){
	
		var image = Caman("#localImg", function () {});
		
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
			Caman.remoteProxy = Caman.IO.useProxy('php');
			bindFliterListener();
		}
	}
})();

$(document).ready(function(){
	FLICKR.getImages.init();
});