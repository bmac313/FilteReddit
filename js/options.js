// Both settings variables are prefixed with 'fr' (filtereddit) so that they will have unique identifiers in case of conflicts in localStorage.
var frDefaultSettings = {
	// Although whitelist functionality has not been implemented yet, I am leaving the code in because I plan to do so in a later version.
	'blackList': ['trump', 'hillary'],
	'whiteList': ['notch', 'bernie']
};
var frUserSettings = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage") {
		sendResponse({data: localStorage[request.key]});
	} else {
		sendResponse({});
	}
});

document.addEventListener('DOMContentLoaded', function() {
	
	//Load settings from localStorage
	frUserSettings = loadSettings();
	
	// Add blacklist items to popup.html
	populateList();
	
	// Get list buttons to prepare for addition of listeners
	var listButtons = document.getElementsByClassName('btn-remove');
	
	// Add event listeners to buttons in popup.html
	document.getElementById('save-settings').addEventListener('click', saveSettings);
	document.getElementById('add-blacklist').addEventListener('click', addItemToList);
	document.getElementById('restore-defaults').addEventListener('click', restoreDefaultSettings);
	for(var i = 0; i < listButtons.length; i++) {
		listButtons[i].addEventListener('click', removeItemFromList);
	}
});

function loadSettings() {
	var settings = {};
	
	//If the settings key's value is null, load defaults. Else, load the data from localStorage.
	console.log(settings);
	if(localStorage["frUserSettings"] === null || localStorage["frUserSettings"] === undefined) {
		localStorage["frUserSettings"] = JSON.stringify(frDefaultSettings);
	}
	
	settings = JSON.parse(localStorage["frUserSettings"]);
	
	return settings;
}

//Fills list with items from localStorage
function populateList() {
	var parent = document.getElementById('blacklist');
	for(var i = 0; i < frUserSettings.blackList.length; i++) {
		var listItem = document.createElement('li');
		listItem.setAttribute("class", "list-item");
		listItem.innerHTML = "<input class='list-item-part btn-remove' type='submit' value='x'></input><div class='list-item-part'>" + frUserSettings.blackList[i] + "</div>";
		parent.appendChild(listItem);
	}
}

//Save current settings to localStorage.
function saveSettings() {
	var listItems = document.getElementsByClassName('list-item');
	var toSave = [];
	
	for(var i = 0; i < listItems.length; i++) {
		toSave.push(listItems[i].innerText);
	}
	
	frUserSettings.blackList = toSave;
	console.log(frUserSettings);
	localStorage["frUserSettings"] = JSON.stringify(frUserSettings);
	alert("Blacklist saved successfully.");
}

// These two functions add or remove items from a list in the popup. They take in an index number, telling them where to add it.
function addItemToList() {
	var parent = document.getElementById('blacklist');
	var userInput = document.getElementById('bl-input-box').value;
	var listButtons = document.getElementsByClassName('btn-remove');
	var listItem = document.createElement('li');
	if(userInput === "") {
		alert("The input box is empty! Please type something first.");
	} else {
		console.log("else block is executing");
		listItem.setAttribute("class", "list-item");
		listItem.innerHTML = "<input class='list-item-part btn-remove' type='submit' value='x'></input><div class='list-item-part'>" + userInput + "</div>";
		parent.appendChild(listItem);
		document.getElementById('bl-input-box').value = "";
		
		//Refresh event listeners so that the newly added buttons will have them
		for(var i = 0; i < listButtons.length; i++) {
		//	listButtons[i].removeEventListener('click', removeItemFromList);
			listButtons[i].addEventListener('click', removeItemFromList);
		}
		
		document.getElementById('bl-input-box').focus();
	}
}

function removeItemFromList() {
	this.parentNode.remove();
}

function restoreDefaultSettings() {
	if(confirm("Are you sure you want to restore default settings? This cannot be undone.")) {
		localStorage["frUserSettings"] = JSON.stringify(frDefaultSettings);
		document.location.reload();
	}
}