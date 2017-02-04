angularTree = function(playlists) {
	var tree = {}
	var subtree = {}

	for(i in playlists) {
		subtree = tree
		parts = playlists[i].split('/')
		for(j in parts) {
			if(!(parts[j] in subtree)) {
				subtree[parts[j]] = {}
			}
			subtree = subtree[parts[j]]
		}
	}

	//create the ugly "item" thing required by the plugin
	items = []
	subitems = items

	hastitle = function(title, subitems) {
		for(i in subitems) {if(subitems[i].title === title){return true}}
		return false
	}

	getitems = function(title, subitems) {
		for(i in subitems) {if(subitems[i].title === title){return subitems[i].items}}
		return 'something went wrong' 
	}

	addItem = function(path, item) {
		subitems = items
		for(var i = 0, l = path.length; i < l; i++) {
			if(hastitle(path[i], subitems)) {
				subitems = getitems(path[i], subitems) 
			} else {
				newitems = []
				subitems.push({
					'title': path[i],
					'items' : newitems
				})
				subitems = newitems
			}
		}
	}

	addAllItems = function myself(path, node) {
		for(item in node) {
			path.push(item)
			addItem(path, item)
			myself(path, node[item]) 
			path.pop(item)
		}
	}

	addIds = function myself(reclevel, parentid, items) {
		for(var i = 0, l = items.length; i < l; i++) {
			items[i].id = parentid + Math.pow(10, reclevel)*(i + 1)
			myself(reclevel+1, items[i].id, items[i].items)
		}
	}

	addAllItems([],tree)
	addIds(0, 0, items)
	return items
}