import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import WorldMap from './WorldMap';
import { countries } from '../utils/constants';

const MapView = (props) => {
	const router = useRouter();

	useEffect(() => {
		// loop through the countries we have superstitions of
		for (var countryName in props.countPerCountry) {
			let countryCode = countries[countryName];
			let countryElement = document.getElementById(countryCode);

			if (countryCode) {
				countryElement.style.fill = getCountryColor(countryName);
			}
		}

		// highlight for the selected country
		const countryEl = document.getElementById(countries[props.country]);
		if (countryEl) countryEl.style.fill = "url(#pattern-circles)";
	}, [props.countPerCountry, props.country]);

	const getCountryColor = (countryName) => {
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
			router.push(`/from/${countryName}`);
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