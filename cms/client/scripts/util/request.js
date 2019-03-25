// @format

function Fetch(path, method = 'GET', data, type = 'json') {
    let contentType = '';

    let headers = {};
    let newData = null;

    switch (type) {
        case 'formData':
            let formData = new FormData();
            formData.append('file', data, data.name);
            newData = formData;
            break;
        case 'json':
        default:
            headers['Content-Type'] = 'application/json';
            newData = JSON.stringify(data);
            break;
    }

    let request = new Request(path, {
        headers: new Headers(headers),
        method: method,
        body: newData,
        credentials: 'include',
    });

    return fetch(request).then(res => {
        // console.log(res.text());
        return res.status === 500 ? Promise.reject(res) : res;
    });
}

export default Fetch;
