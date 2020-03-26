import Cookies from 'universal-cookie';

let cookies = new Cookies();

let getCookieData = function() {
    let cookie = cookies.get('superstitiousNw');

    // set SN cookie if not already there
    if (!cookie) {
        cookies.set('superstitiousNw', {userLikes: [], userComments: []}, {path: '/' });
        cookie = cookies.get('superstitiousNw');
    }

    // since initially we could only have a list of likes set on the cookie,
    // check if there's something in that list, and move it to userLikes if there is
    if (cookie.constructor === Array && cookie.length > 0){
        let likedSuperstitions = cookies.get('superstitiousNw');
        cookies.set('superstitiousNw',
            { userLikes: likedSuperstitions, userComments: [] },
            { path: '/' }
        );

        return {
            userLikes: likedSuperstitions,
            userComments: []
        };

    } else {
        return {
            userLikes: cookies.get('superstitiousNw')['userLikes'],
            userComments: cookies.get('superstitiousNw')['userComments']
        };
    }
}

let setCookieData = function(data) {
    cookies.set('superstitiousNw', data, {path: '/' });
}

export { getCookieData, setCookieData };