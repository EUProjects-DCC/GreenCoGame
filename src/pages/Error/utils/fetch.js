const backend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80';

//Get the error message for a question in an specific language
export const getErrorMessage =  (type, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
        type: type,
        language: language,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/getErrorMessage`,requestOptions)
}