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

		$btn_elem.parent().attr( 'aria-expanded', 'false' )

		// handles clicks and functions
		$btn_elem.on( "click", function( e ) {
			var elem = e.currentTarget
			var	elemActive = elem.classList[ elem.classList.length - 1 ]
			var active = classname.toString()
			var $parent = elem.offsetParent

			if ( elemActive !== active ) {
				$btn_elem.addClass( active )
				$menu_elem.addClass( active )
				$parent.setAttribute( 'aria-expanded', 'true' )
			} else {
				$btn_elem.removeClass( active )
				$menu_elem.removeClass( active )
				$parent.setAttribute( 'aria-expanded', 'false' )
			}
		} )
	}
}

$( function() {
	toggler._init( ".page-nav-wrap", ".page-nav-button", "active" );
});