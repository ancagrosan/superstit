import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import WorldMap from './WorldMap';
import { countries } from './constants';

const objectFlip = (obj) => {
	const ret = {};
	Object.keys(obj).forEach(key => {
		ret[obj[key]] = key;
	});
	return ret;
}

const codeToCountryName = objectFlip(countries);

const MapView = (props) => {
	const history = useHistory();

	useEffect(() => {
		let totalCount = Object.values(props.countPerCountry)
			.reduce((accumulator, countryCount) => accumulator + countryCount, 0);

		// loop through the countries we have supersitions of
		for (var countryName in props.countPerCountry) {
			let countryCode = countries[countryName];
			let countryElement = document.getElementById(countryCode);

			if (countryCode) {
				countryElement.style.fill = getCountryColor(countryName, totalCount);

				// special not so special :( highlight for the current country
				if (countryName === props.country) {
					countryElement.style.fill = "#b74243";
				}
			}
		}
	}, [props.countPerCountry, props.country]);

	const getCountryColor = (countryName, totalCount) => {
		const countPerCountry = props.countPerCountry;
		const countryPercentage = Math.round(countPerCountry[countryName] / totalCount * 100) / 5;
		return "hsla(55,100%,50%," + countryPercentage + ")";
	}

	const selectCountry = (e) => {
		const targetCountryCode = e.target.getAttribute('id');
		const countryName = codeToCountryName[targetCountryCode];

		if (countryName) {
			history.push(`/from/${countryName}`);
		}
	}

	const showCountryNameTooltip = (e) => {
		const targetCountryCode = e.target.getAttribute('id');
		const countryName = codeToCountryName[targetCountryCode];

	}

	return (
		<WorldMap onClick={selectCountry} onMouseOver={showCountryNameTooltip} />
	)
}

export default MapView;