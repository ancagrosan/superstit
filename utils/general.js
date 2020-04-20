
const addOrRemoveFromArray = (arr, id) => {
	const isLiked = !!arr.find((value) => {
		return value === id;
	});
	let likedIds = [];

	if (isLiked) {
		likedIds = arr.filter((value) => {
			return value !== id;
		});
	} else {
		likedIds = [...arr, id];
	}
	return likedIds
};

const pluralize = (count, noun, suffix = 's') =>
	`${count} ${noun}${count !== 1 ? suffix : ''}`;

export { addOrRemoveFromArray, pluralize };
