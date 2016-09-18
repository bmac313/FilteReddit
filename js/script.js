/*	FILTEREDDIT
 *  
 *  Goal:       Write a program that blocks Reddit posts by keyword. Users should be able to keep
 *              a list of keywords they want to block ( a "blacklist").
 *              Start by adding post blocking functionality and be sure it works first, then add other features.
 *
 *  Solution:   Use JavaScript to make edits to Reddit's DOM. First, the elements that need to be selected are loaded
 *              into an HTMLCollection by class name. Then, the program
 *              loops through each HTMLCollection; for each element, it looks at the innerHTML of that element and tries
 *              to find a word / phrase from the blacklist. If it finds one, it adds the class "blacklisted" to the element
 *              (this is done by accessing the specific element and adding the class to its className property; i.e: e.classname += " blacklisted").
 *              Finally, it replaces the innerHTML of elements with the class "blacklisted" with a "blocked" message. It also stores
 *              the original innerHTML so that users can return it to normal by clicking "show".
 *
 * To-do:     - Set up "remove item" buttons in popup. Event listeners will have to be added when the list is populated AND every time an item is added.
 *            - Fix issues (if needed).
 *
 * Issues:    - 
 *	
 */

//Takes in user settings data from the request / response in main();
//Adds style="display:none;" to elements to hide them.
function blockPosts(settings) {
	var userSettings = JSON.parse(settings);
	var posts = document.getElementsByClassName("link");  //HTMLCollection containing all videos with the specified tag.'
	//Using dummy values for both lists until I set up the load from localStorage feature.
	console.log(userSettings);
	var blacklist = userSettings.blackList;
	console.log(blacklist);
	
	// Scan the html of each post for blacklisted words.
	for(var i = 0; i < posts.length; i++) {
		var html = posts[i].innerHTML.toLowerCase();
		
		for(var j = 0; j < blacklist.length; j++) {
			//if the html includes something on the blacklist...
			if(html.includes(blacklist[j])) {
				posts[i].setAttribute("style", "display:none;");
				console.log("A post containing '" + blacklist[j] + "' was blocked.");	
			}
		}
	}
}

//The master function for the content script.
function main() {
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "frUserSettings"}, function(response) {
		console.log(response.data);
		blockPosts(response.data);
		console.log("Page loaded");
	});
}

//Main function call. DO NOT REMOVE!
main();