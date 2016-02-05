var toggler = {
	_vars: {
		btn: '',
		menu: '',
		active: ''
	},

	_menu: function() {
		// only return menu properties
		return $menu_elem = $( this._vars.menu )
	},

	_button: function() {
		// only return button properties
		return $btn_elem = $( this._vars.btn )
	},

	_init: function( menu, button, classname ) {
		// sets functional properties
		this._vars.menu = menu
		this._vars.btn = button
		this._vars.active = classname

		// inherits props from menu and button to use
		this._button(); // returns jquery element $btn_elem
		this._menu(); // returns jquery element $menu_elem

		// handles clicks and functions
		$btn_elem.on( "click", function( e ) {
			var elemParent
			var elem = e.currentTarget
			var	elemActive = elem.classList
			var active = classname.toString()

			if ( elemActive == 0 ) {
				$btn_elem.attr( 'aria-expanded', 'true' ).addClass( active )
			} else {
				console.log( elem.classList );
				$btn_elem.attr( 'aria-expanded', 'false' ).removeClass( active )
			}
		} )
	}
}

$( function() {
	toggler._init( ".page-nav-l1-lst", "#navicon", "open" );
});