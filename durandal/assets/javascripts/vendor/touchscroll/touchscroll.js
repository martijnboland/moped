define(function () {
  return {
		isOldAndroidTouchDevice: isOldAndroidTouchDevice,
		fixScroll: fixScroll
  };

  function isOldAndroidTouchDevice(){
		if(!navigator.userAgent.match(/android 2/i)) {
			return false;
		}
		return (typeof Modernizr !== 'undefined' && Modernizr.touch)
	}

	function fixScroll(id){
		if(isOldAndroidTouchDevice()){ 
			var el=document.getElementById(id);
			var scrollStartPosY=0;
			var scrollStartPosX=0;

			document.getElementById(id).addEventListener("touchstart", function(event) {
				scrollStartPosY=this.scrollTop+event.touches[0].pageY;
				scrollStartPosX=this.scrollLeft+event.touches[0].pageX;
				//event.preventDefault(); // Keep this remarked so you can click on buttons and links in the div
			},false);

			document.getElementById(id).addEventListener("touchmove", function(event) {
				// These if statements allow the full page to scroll (not just the div) if they are
				// at the top of the div scroll or the bottom of the div scroll
				// The -5 and +5 below are in case they are trying to scroll the page sideways
				// but their finger moves a few pixels down or up.  The event.preventDefault() function
				// will not be called in that case so that the whole page can scroll.
				if ((this.scrollTop < this.scrollHeight-this.offsetHeight &&
					this.scrollTop+event.touches[0].pageY < scrollStartPosY-5) ||
					(this.scrollTop != 0 && this.scrollTop+event.touches[0].pageY > scrollStartPosY+5))
						event.preventDefault();	
				if ((this.scrollLeft < this.scrollWidth-this.offsetWidth &&
					this.scrollLeft+event.touches[0].pageX < scrollStartPosX-5) ||
					(this.scrollLeft != 0 && this.scrollLeft+event.touches[0].pageX > scrollStartPosX+5))
						event.preventDefault();	
				this.scrollTop=scrollStartPosY-event.touches[0].pageY;
				this.scrollLeft=scrollStartPosX-event.touches[0].pageX;
			},false);
		}
	}
});
