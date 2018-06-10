/**
 * justifyRows layout mode
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var JustifyRows = LayoutMode.create('justifyRows');

var proto = JustifyRows.prototype;

proto._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

proto._getRowHeight = function( rowItems, containerWidth ) {
  containerWidth = containerWidth - rowItems.length * this.gutter;
  var totalHeight = 0;
  for ( var i = 0, len = rowItems.length; i !== len; i++ ) {
    var itemEle = rowItems[i].element,
        w = parseInt( itemEle.getAttribute( 'data-width' ), 10 ) || rowItems[i].size.outerWidth,
        h = parseInt( itemEle.getAttribute( 'data-height' ), 10 ) || rowItems[i].size.outerHeight;

    totalHeight += w / h;
  }

  return containerWidth / totalHeight;
};

proto._resizeItems = function( rowItems, rowHeight ) {
  for ( var i = 0, len = rowItems.length; i !== len; i++ ) {
    var itemEle = rowItems[i].element,
        w = parseInt( itemEle.getAttribute( 'data-width' ), 10 ) || rowItems[i].size.outerWidth,
        h = parseInt( itemEle.getAttribute( 'data-height' ), 10 ) || rowItems[i].size.outerHeight;

    itemEle.style.width = rowHeight * w / h + 'px';
    itemEle.style.height = rowHeight + 'px';
  }
};

proto._beforeLayout = function() {
  var maxHeight = this.options.maxHeight || 200,
      containerWidth = this.isotope.size.innerWidth + this.gutter;

  var checkItems = this.isotope.filteredItems.slice( 0 ),
      row, rowHeight;
  
  newRow: while ( checkItems.length > 0 ) {
    
    for ( var i = 0, len = checkItems.length; i !== len; i++ ) {
      row = checkItems.slice( 0, i + 1 ),
      rowHeight = this._getRowHeight( row, containerWidth );

      if ( rowHeight < maxHeight ) {
        this._resizeItems( row, rowHeight );
        checkItems = checkItems.slice( i + 1 );
        continue newRow;
      }
    }

    // last row
    this._resizeItems( row, Math.min( rowHeight, maxHeight ) );
    break;  
  }
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();
  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;

  return position;
};

proto._getContainerSize = function() {
  return { height: this.maxY };
};

return JustifyRows;

}));
