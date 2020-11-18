//import { URLParamService } from './URLParamService';

export class Controller {
	constructor() {
		this.pseData = '';

		this.loadPSEData();
	}

	/**
	 * Callbackfunktion, wenn die Sprachen geladen wurden
	 * @param Labels
	 */
	loadPSEData() {
		console.log("loadPSEData")

		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.baenae.de/pse/getElements.php', true);

		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				// Success!
				this.pseData = JSON.parse(this.response);
				this.buildPixi();
			} else {
				// We reached our target server, but it returned an error

			}
		};

		request.onerror = function() {
			// There was a connection error of some sort
		};

		request.send();
	}

	buildPixi() {

	}
}
