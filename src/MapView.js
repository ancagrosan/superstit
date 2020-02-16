import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import WorldMap from './WorldMap';
import { countries } from './constants';

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

				// highlight for the current country
				if (countryName === props.country) {
					countryElement.style.fill = "url(#pattern-circles)"
				}
			}
		}
	}, [props.countPerCountry, props.country]);

	const getCountryColor = (countryName, totalCount) => {
		const countPerCountry = props.countPerCountry;

		if (countPerCountry[countryName] === 0) {
			return;
		}

		// Color scheme in steps
		if (countPerCountry[countryName] <= 4) {
			return '#EFB881';
		} else if (countPerCountry[countryName] <= 8) {
			return '#BF9A76';
		} else if (countPerCountry[countryName] <= 15) {
			return '#8C6033';
		} else {
			return '#664D34';
		}
	}

	const selectCountry = (e) => {
		const countryName = e.target.getAttribute('title');

		if (countryName) {
			history.push(`/from/${countryName}`);
		}
	}

	const showCountryNameTooltip = (e) => {
		const countryName = e.target.getAttribute('title');

		if (countryName) {
			let tooltip = document.getElementById("tooltip");
			tooltip.innerHTML = countryName;
			tooltip.style.display = "block";

			// todo: improve tooltip positioning
			tooltip.style.left = e.pageX - 450 + 'px';
			tooltip.style.top = e.pageY + 50 + 'px';
		}
	}

	const hideTooltip = () => {
		let tooltip = document.getElementById("tooltip");
		tooltip.style.display = "none";
	}

	return (
		<>
			<WorldMap
				onClick={selectCountry}
				onMouseOver={showCountryNameTooltip}
				onMouseOut={hideTooltip}
			/>
			<div id="tooltip" className="tooltip" display="none"></div>
		</>
	)
}

export default MapView;