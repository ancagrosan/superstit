import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import WorldMap from './WorldMap';
import { countries } from '../utils/constants';

const MapView = (props) => {
	const router = useRouter();
	const tooltipRef = useRef(null);

	useEffect(() => {
		// loop through the countries we have superstitions of
		for (let countryName in props.countPerCountry) {
			let countryCode = countries[countryName];
			let countryElement = document.getElementById(countryCode);

			if (countryCode && countryElement) {
				countryElement.style.fill = getCountryColor(countryName);
			}
		}

		// highlight for the selected country
		const countryEl = document.getElementById(countries[props.country]);
		if (countryEl) {
			countryEl.style.fill = "url(#pattern-circles)";
		}
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
			tooltipRef.current.innerHTML = countryName;
			tooltipRef.current.style.display = "block";

			// todo: improve tooltip positioning
			tooltipRef.current.style.left = e.pageX - 450 + 'px';
			tooltipRef.current.style.top = e.pageY + 50 + 'px';
		}
	}

	const hideTooltip = () => {
		tooltipRef.current.style.display = "none";
	}

	return (
		<>
			<WorldMap
				onClick={selectCountry}
				onMouseOver={showCountryNameTooltip}
				onMouseOut={hideTooltip}
			/>
			<div className="tooltip" display="none" ref={tooltipRef}></div>
		</>
	)
}

export default MapView;