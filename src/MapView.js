import React, { Component } from 'react';
import WorldMap from './WorldMap';
import { countries } from './constants';

class MapView extends Component {
	componentDidMount(){

		let totalCount = Object.values(this.props.countPerCountry)
			.reduce((accumulator, countryCount) => accumulator + countryCount, 0);

		// loop through the countries we have supersitions of
		for (var countryName in this.props.countPerCountry) {
			let countryCode = countries[countryName];

			if (countryCode) {
				let countryElement = document.getElementById(countryCode)
				countryElement.style.fill = this.getCountryColor(countryName, totalCount);

				// special not so special :( highlight for the current country
				if (countryName === this.props.country){
					countryElement.style.fill =  "#b74243";
				}

				// disable for the rest?
			}
		}
	}

	getCountryColor(countryName, totalCount){
		const countPerCountry = this.props.countPerCountry;
		const countryPercentage = Math.round(countPerCountry[countryName]/totalCount*100)/5;
		return "hsla(55,100%,50%," + countryPercentage + ")";
	}

	render() {
		return (
			<WorldMap/>
		)
	}
}

export default MapView;