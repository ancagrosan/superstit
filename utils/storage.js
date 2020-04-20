const getStoredData = () => {
    let userLikes = [];
    let userComments = [];

    try {
        userLikes = JSON.parse(localStorage?.getItem("SNLikes") || "[]")
    } catch (error) {
        console.warn(error);
    }

    try {
        userComments = JSON.parse(localStorage?.getItem("SNComments") || "[]")
    } catch (error) {
        console.warn(error);
    }

    return { userLikes, userComments };
}

const setLiked = (data) => {
    localStorage.setItem("SNLikes", JSON.stringify(data));
}

const setCommented = (data) => {
    localStorage.setItem("SNComments", JSON.stringify(data));
}

export { getStoredData, setLiked, setCommented };