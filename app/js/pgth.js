var toggler = {
	_vars: {
		hdr: '', 	
		uls: '',
		active: ''
	},
	config: function( hdr, uls, ac ) {
		// var t = this._vars
		// 	t.hdr = hdr,
		// 	t.uls = uls,
		// 	t.active = ac;
	},
	binder: function() {

	}
};

$(function() {
	$('.page-nav-l1-hdr').on('click', function(e) {
		var target = e.currentTarget,	
			sibling = target.nextElementSibling,
			active = 'active',	
			targetclass = target.classList[0] + '-' + active,
			siblingclass = target.nextElementSibling.classList[1] + '-' + active;
		
		$( target ).toggleClass( targetclass );
		$( sibling ).toggleClass( siblingclass );
	});
});