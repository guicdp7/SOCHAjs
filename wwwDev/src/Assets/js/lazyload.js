    var lazyLoad = {};
    lazyLoad.timer = document.querySelectorAll('[timer-ll]')[0] || 400;
    lazyLoad.cache = [];
    lazyLoad.verify = null;
    lazyLoad.throttleTimer = new Date().getTime();
    lazyLoad.forceLoadImages = function (selector) {
        /*
         * Example: lazyLoad.forceLoadImages('img[data-src]');
         */
        var imageNodes = document.querySelectorAll(selector);
        for (var i = 0; i < imageNodes.length; i++) {
            var imageNode = imageNodes[i];
	    imageNode.className = imageNode.className.replace(/(^|\s+)lazy-ll(\s+|$)/, '$1lazy-load$2');	    
            imageNode.src = imageNode.getAttribute('data-src');	                
            setTimeout(function () {		
                imageNode.className = imageNode.className.replace(/(^|\s+)lazy-loaded(\s+|$)/, '$1$2');
            }, 1100);	    
        }
    };
    lazyLoad.addObservers = function () {
        addEventListener('scroll', lazyLoad.throttledLoad);
        addEventListener('resize', lazyLoad.throttledLoad);
        addEventListener('DOMSubtreeModified', lazyLoad.throttledLoad);
    };
    lazyLoad.removeObservers = function () {
        removeEventListener('scroll', lazyLoad.throttledLoad, false);
        removeEventListener('resize', lazyLoad.throttledLoad, false);
        removeEventListener('DOMSubtreeModified', lazyLoad.throttledLoad, false);
    };
    lazyLoad.throttledLoad = function () {
        var now = new Date().getTime();
        if ((now - lazyLoad.throttleTimer) >= 200) {
            lazyLoad.throttleTimer = now;
            lazyLoad.loadVisibleImages();
        }
    };
    lazyLoad.loadVisibleImages = function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var pageHeight = window.innerHeight || document.documentElement.clientHeight;
        var range = {
            min: scrollY - 200,
            max: scrollY + pageHeight + 200
        };
        var i = 0;
        var ll;
        while (i < lazyLoad.cache.length) {
            var image = lazyLoad.cache[i];
            var imagePosition = lazyLoad.getOffsetTop(image);
            var imageHeight = image.height || 0;
            if ((imagePosition >= range.min - imageHeight) && (imagePosition <= range.max)) {		
                ll = image.getAttribute('data-src');
                image.onload = function () {			
			image.className = image.className.replace(/(^|\s+)lazy-ll(\s+|$)/, '$1lazy-load$2');
			image.className = image.className.replace(/(^|\s+)lazy-load(\s+|$)/, '$1lazy-loaded$2');
                };
                if (ll) {			
			image.src = ll;
			image.removeAttribute('data-src');			
                }
                lazyLoad.cache.splice(i, 1);
                continue;
            }
            i++;
        }

        if (lazyLoad.cache.length === 0) {
            lazyLoad.removeObservers();
            clearInterval(lazyLoad.verify);
        }
    };
    lazyLoad.removeScripts = function () {
        var ns = document.querySelectorAll('.ns-ll');
        for (var i = 0; i < ns.length; i++) {
            var n = ns[i];
            n.parentNode.removeChild(n);
        }
    };
    lazyLoad.init = function () {
        lazyLoad.removeScripts();
        if (!document.querySelectorAll) {
            document.querySelectorAll = function (selector) {
                var doc = document, head = doc.documentElement.firstChild, styleTag = doc.createElement('STYLE');
                head.appendChild(styleTag);
                doc.__qsaels = [];
                styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
                window.scrollBy(0, 0);
                return doc.__qsaels;
            };
        }
        var imageNodes = document.querySelectorAll('img[data-src]');
        for (var i = 0; i < imageNodes.length; i++) {
            var imageNode = imageNodes[i];
            lazyLoad.cache.push(imageNode);
        }
        lazyLoad.addObservers();
        lazyLoad.loadVisibleImages();
        lazyLoad.verify = setInterval(function () {
            if (document.createEventObject) {
                window.dispatchEvent(new Event('scroll'));
            } else {
                var evt = document.createEvent('UIEvents');
                evt.initUIEvent('scroll', true, false, window, 0);
                window.dispatchEvent(evt);
            }
        }, lazyLoad.timer);
    };
    // For IE7 compatibility
    // Adapted from http://www.quirksmode.org/js/findpos.html
    lazyLoad.getOffsetTop = function (el) {
        var val = 0;
        if (el.offsetParent) {
            do {
                val += el.offsetTop;
            } while (el = el.offsetParent);
            return val;
        }
    }
	
