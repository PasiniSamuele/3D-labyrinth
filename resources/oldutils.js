//
//  LOADING UTILS
//

function loadTextResource(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url + "?a=" + Math.random(), true);
        request.onload = function () {
            if (request.status < 200 || request.status > 299) {
                reject("Error: HTTP Status " + request.status + " on resource: " + url);
            } else {
                resolve(request.responseText);
            }
        };
        request.send();
    });
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = function () {
            resolve(image);
        }
        image.src = url;
    })
}

function loadJSONResource(url) {
    return new Promise((resolve, reject) => {
        loadTextResource(url)
            .then(
                (result) => {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }
                , (error) => {
                    reject(error);
                }
            )
    })
}
