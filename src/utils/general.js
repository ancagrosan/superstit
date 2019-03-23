
let addOrRemoveFromArray = function(arr, id){
	const isLiked = !!arr.find((value) => {
		return value === id;
	});
	let likedIds = [];

	if (isLiked){
		likedIds = arr.filter((value) => {
		return value !== id;
	});
	} else {
		likedIds = [ ...arr, id ];
	}
	return likedIds
};

export { addOrRemoveFromArray };