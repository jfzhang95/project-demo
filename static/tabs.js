/*
------------------------------------------------------------------------
TABS SCRIPT
------------------------------------------------------------------------
 
*/

var menuscript={
	disabletablinks: false, ////Disable hyperlinks in 1st level tabs with sub contents (true or false)?
	currentpageurl: window.location.href.replace("http://"+window.location.hostname, "").replace(/^\//, ""), //get current page url 

definemenu:function(tabid, dselected){
	this[tabid+"-menuitems"]=null
	this.addEvent(window, function(){menuscript.init(tabid, dselected)}, "load")
},

showsubmenu:function(tabid, targetitem){
	var menuitems=this[tabid+"-menuitems"]
 for (i=0; i<menuitems.length; i++){
		menuitems[i].className=""
		if (typeof menuitems[i].hasSubContent!="undefined")
			document.getElementById(menuitems[i].getAttribute("rel")).style.display="none"
	}
	targetitem.className="current"
	if (typeof targetitem.hasSubContent!="undefined")
		document.getElementById(targetitem.getAttribute("rel")).style.display="block"
},

isSelected:function(menuurl){
	var menuurl=menuurl.replace("http://"+menuurl.hostname, "").replace(/^\//, "")
	return (menuscript.currentpageurl==menuurl)
},

addEvent:function(target, functionref, tasktype){ //assign a function to execute to an event handler (ie: onunload)
	var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
	if (target.addEventListener)
		target.addEventListener(tasktype, functionref, false)
	else if (target.attachEvent)
		target.attachEvent(tasktype, functionref)
},

init:function(tabid, dselected){
	var menuitems=document.getElementById(tabid).getElementsByTagName("a")
	this[tabid+"-menuitems"]=menuitems
	for (var x=0; x<menuitems.length; x++){
		if (menuitems[x].getAttribute("rel")){
			this[tabid+"-menuitems"][x].hasSubContent=true
			if (menuscript.disabletablinks)
				menuitems[x].onclick=function(){return false}
		}
		else //for items without a submenu, add onMouseout effect
			menuitems[x].onmouseout=function(){this.className=""}
		menuitems[x].onclick=function(){menuscript.showsubmenu(tabid, this)}
		if (dselected=="auto" && typeof setalready=="undefined" && this.isSelected(menuitems[x].href)){
			menuscript.showsubmenu(tabid, menuitems[x])
			var setalready=true
		}
		else if (parseInt(dselected)==x)
			menuscript.showsubmenu(tabid, menuitems[x])
	}
}
}
menuscript.definemenu("tab_menu", 0)