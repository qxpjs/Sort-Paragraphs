/*
File: Sort Paragraphs.js
Description: This script sorts all the paragraphs of a selected text box, in the order based on input from user.
*/

//import basic checks
if (typeof (isLayoutOpen) == "undefined") {
	//import basic checks
	app.importScript(app.getAppScriptsFolder() + "/Dependencies/qx_validations.js");
	console.log("Loaded library qx_validations.js for basic validation checks.");
}
if (isLayoutOpen()) {
	let confirmation = confirm("This Script will remove all features which are NOT supported by qxml such as Callouts, Footnotes, Endnotes, Cross References, Anchors etc. from the selected box.\nDo you want to continue?");
	if (confirmation) {
		//Set the desired Sort Order, True: Ascending Order, False: Descending Order
		let sortAscending = false;
		//Set the desired Data Format, True: Numeric Data, False: String Data
		let sortAsNumericData = false;

		//Get all Selected Boxes from the Layout
		let activeBoxes = getSelectedTextBoxes();

		if (null != activeBoxes) {
			//Ask for user Input
			sortOrder = getSortOrder();
			dataType = getDataType();

			if (null === sortOrder || null === dataType) {
				console.log("Operation canceled.");
			}
			else {
				sortAscending = (sortOrder.toLowerCase() == "ascending"); //True if "Ascending", otherwise false
				sortAsNumericData = (dataType.toLowerCase() == "numbers"); //True if "Text", otherwise false

				console.log("Ascending Order: " + sortAscending + ", Numeric Data: " + sortAsNumericData);

				//Iterate through all active boxes
				for (let i = 0; i < activeBoxes.length; i++) {
					//Get all the text runs from the box
					let boxParas;
					boxParas = activeBoxes[i].getElementsByTagName("qx-p");

					if (null != boxParas) {
						let parentNode = boxParas[0].parentNode;

						//Convert Para Nodes to an Array
						let sortedParas = new Array();
						sortedParas = Array.prototype.slice.call(boxParas);

						//Delete the original paragraphs
						removeNodes(boxParas);

						//Sort the Paras
						sortArray(sortedParas, sortAscending, sortAsNumericData);

						//Insert the New Paras						
						let paraCount = appendParasInNode(parentNode, sortedParas);
						console.log(paraCount + " paragraphs sorted in Box " + i + ".");
					}
				}
			}
		}
	}
}

/* Function to get Valid Sort Order from the User
*/
function getSortOrder() {
	let strPrompt = "Please enter the desired sort order: ";
	let strDefaultValue = "Ascending";
	let validValues = ["Ascending", "Descending"];
	let boolShowListInPrompt = true;
	let boolIsCaseSensitive = false;
	return getValidInputFromList(validValues, strPrompt, strDefaultValue, boolShowListInPrompt, boolIsCaseSensitive);
}

/* Function to get Valid Data Type from the User
*/
function getDataType() {
	let strPrompt = "Please enter the type of data being sorted: ";
	let strDefaultValue = "Text";
	let validValues = ["Text", "Numbers"];
	let boolShowListInPrompt = true;
	let boolIsCaseSensitive = false;
	return getValidInputFromList(validValues, strPrompt, strDefaultValue, boolShowListInPrompt, boolIsCaseSensitive);
}

/* Function to Sort the passed Array, as per sorting parameters
arrayToSort: Array that needs to be sorted
sortAscending: true= Ascending, false= Descending
sortAsNumericData: true= Number, false= Text
*/
function sortArray(arrayToSort, sortAscending, sortAsNumericData) {
	//Sort the Array based on content
	arrayToSort.sort(function (ea, eb) {
		let returnValue = 0;
		let a = ea.textContent;
		let b = eb.textContent;

		//console.log("Sort, Comparing '" + a + "' WITH '" + b+"'");
		if (sortAsNumericData) {//Compare as numeric data
			returnValue = (parseFloat(a) - parseFloat(b));
		}
		else {//Compare as Strings
			returnValue = a.localeCompare(b); //Makes it work on all languages	
		}

		if (!sortAscending) {//Descending Order, reverse the return value
			returnValue = -returnValue;
		}

		return returnValue; //Observe the negative sign
	});
}

/* Function to append para nodes in a story
parentNode: Story node for paras
parasToAppend: Which para nodes to append
*/
function appendParasInNode(parentNode, parasToAppend) {
	//Update the Story with the Paras
	//console.log("Adding paras to: " + parentNode.outerHTML);
	parasToAppend.forEach(function (para) {
		//console.log("Adding: " + para.outerHTML);
		parentNode.appendChild(para);
	});
	return parasToAppend.length;
}

/* Function to Remove Para Nodes
nodesToRemove: Which nodes to removed
*/
function removeNodes(nodesToRemove) {
	let counter = 1;
	//Keep removing the first element as long as it is NOT null
	do {// to traverse through all the entities of array
		//console.log("Deleting: Item " + counter + ", node: " + nodesToRemove[0].outerHTML);
		nodesToRemove[0].remove();
		counter++;
	} while (nodesToRemove.length > 0) //(nodesToRemove[0] != null)
}
