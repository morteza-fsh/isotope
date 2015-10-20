/**
 * Isotope Item
**/

( function( window, factory ) {
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'outlayer/outlayer',
    ],
    factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
        require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.Item = factory(
        window.Outlayer
    );
  }

}( window, function factory( Outlayer ) {
'use strict';

// -------------------------- Item -------------------------- //

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

var proto = Item.prototype = Object.create( Outlayer.Item.prototype );

var _create = proto._create;
proto._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  _create.call( this );
  this.sortData = {};
};

proto.updateSortData = function() {
  if ( this.isIgnored ) {
    return;
  }
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  var sorters = this.layout._sorters;
  for ( var key in getSortData ) {
    var sorter = sorters[ key ];
    this.sortData[ key ] = sorter( this.element, this );
  }
};

// override reveal method
var _setPosition = proto.setPosition;
proto.setPosition = function() {  
  _setPosition.apply( this, arguments );

  if ( !this._lazyloadStarted && this.layout.options.lazyload ) {
    this._lazyloadStarted = true;
    this._lazyload();
  }
};

proto._lazyload = function() {
  var images = this.element.querySelectorAll('img[data-src]');
  for ( var i = 0, len = images.length; i !== len; i++ ) {
    var img = images[i];
    img.setAttribute('src', img.getAttribute('data-src'));
    img.removeAttribute('data-src');
  }

  var imagesLoadedInstance;
  if ( this.layout.options.useImagesLoaded && window.imagesLoaded ) {
    imagesLoadedInstance = window.imagesLoaded( this.element );
  }

  this.layout.dispatchEvent( 'itemLoading', null, [ this, imagesLoadedInstance ] );
};

var _destroy = proto.destroy;
proto.destroy = function() {
  // call super
  _destroy.apply( this, arguments );
  // reset display, #741
  this.css({
    display: '',
  });
};

return Item;

} ) );
