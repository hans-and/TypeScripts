import { StringOperationResult } from './StringOperationResult';

function getBaseUrl() {
	return 'http://localhost:8080';
}

function copyByName(source: HTMLElement, destination: Object) {
	var childnodes = source.childNodes;
	childnodes.forEach(
		function onNode(currentValue) {
			if (currentValue instanceof HTMLElement) {
				if ((<HTMLElement>currentValue).hasAttribute('jfield')) {
					var jfieldvalue: string = (<HTMLElement>currentValue).getAttribute('jfield');
					if (jfieldvalue === 'value') {
						var name: string = (<HTMLElement>currentValue).getAttribute('name');
						if (currentValue instanceof HTMLTextAreaElement) {
							destination[name] = (<HTMLTextAreaElement>currentValue).value;
						} else if (currentValue instanceof HTMLInputElement) {
							if (currentValue.hasAttribute('checked')) {
								destination[name] = (<HTMLInputElement>currentValue).getAttribute('checked');
							}
						} else if (currentValue instanceof HTMLSelectElement) {
							destination[name] = currentValue[currentValue.selectedIndex].getAttribute('value');
						}
					}
				}
				if (currentValue.hasChildNodes) {
					copyByName(currentValue, destination);
				}
			}
		}
	);

}


function unionOperationOrg() {

	var res: string;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:8080/greeting', true);
	request.send();
	request.onload = function () {
		if (request.readyState == 4 && request.status == 200) {
			try {
				var jsonobjdata: StringOperationResult = JSON.parse(request.responseText);
				res = jsonobjdata.result;
			} catch (error) {
				res = res + "parse error" + error;
			}

			console.log(jsonobjdata);
		} else {
			res = res + " WTF!!!!!!!!";
			console.error(request.responseText);
		}




		(<HTMLTextAreaElement>document.getElementById("list-op-result-text")).value = "Hasse -sasas---" + res;

		console.log("apa");

	}
}


function unionOperation(source: HTMLElement, destination: HTMLTextAreaElement) {

	var obj: Object = {};
	copyByName(source, obj);

	var request = new XMLHttpRequest();
	request.open('POST', 'http://localhost:8080/list/operation', true);
	request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

	request.send(JSON.stringify(obj));

	request.onload = function () {
		if (request.readyState == 4 && request.status == 200) {
			try {
				destination.value = request.responseText;
			} catch (error) {
			}
		}

	}

}

function simpleGet(requestMapping: string, pOnload: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) {
	var request = new XMLHttpRequest();
	request.open('GET', getBaseUrl() + requestMapping, true);
	request.send();
	request.onload = pOnload;
}

function getGreetingOrg(destination: HTMLElement) {

	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:8080/greeting', true);
	request.send();


	request.onload = function () {
		if (request.readyState == 4 && request.status == 200) {
			try {
				var jsonobjdata: StringOperationResult = JSON.parse(request.responseText);
				destination.innerHTML = jsonobjdata.result;
			} catch (error) {
				console.log(error)
				destination.innerHTML = "Något gick fel"
			}

		} else {
			destination.innerHTML = "Något gick fel"
		}

	}
}

function getGreeting(destination: HTMLElement) {

	simpleGet('/greeting',
		function () {
			if (this.readyState == 4 && this.status == 200) {
				try {
					var jsonobjdata: StringOperationResult = JSON.parse(this.responseText);
					destination.innerHTML = jsonobjdata.result;
				} catch (error) {
					console.log(error)
					destination.innerHTML = "Något gick fel"
				}
			} else {
				destination.innerHTML = "Något gick fel"
			}

		}
	);
}


function initTree(treeId: string) {
	var tree = document.getElementById(treeId);

	var toggler = tree.getElementsByClassName("caret");
	var i: number;

	for (i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function () {
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.classList.toggle("caret-down");
		}
		);
	}

}