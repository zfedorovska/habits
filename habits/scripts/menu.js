function Menu (sSelector){
	var m = this;
	
	//properties
	m.menu = $(sSelector);
	m.menuItems = m.menu.children("li");

	
	//methods
	m.showSubmenu = function(){
		$(this).children(".b-submenu")
			.stop()
			.css("display","block")
			.animate({"opacity" : 1}, 600)
	}
	
	m.hideSubmenu = function(){
		$(this).children(".b-submenu")
			.stop()
			.animate({"opacity" : 0}, 600, function(){
				$(this).css("display","none");
			});
	}	
	
	//events
	m.menuItems
		.mouseover(m.showSubmenu)
		.mouseout(m.hideSubmenu);
}