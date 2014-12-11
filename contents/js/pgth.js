var toggler = {
	_vars: {
		element: '',
		uls: '',
		active: 'active'
	},
	_con: function( elem, ev, activator ) {
		$( elem ).on( ev, activator, function( ev ) {
			var	active = this._vars.active,
				elem = ev.currentTarget,
				elemActive = elem.classList[0] + '-' + active,
				$this = $( elem );
		});
	}
}

$( function() {
	$( '.page-nav-lst' ).on( 'click', '.page-nav-l1-itm', function( e ) {
		var	active = 'active';
		var elem = e.currentTarget;
		var	elemActive = elem.classList[0] + '-' + active;
		var	$this = $( elem );

		$this.addClass( elemActive ).children().toggleClass( active, $this.hasClass(elemActive) );
		$this.siblings().removeClass( elemActive ).children().removeClass( active );
	});
})