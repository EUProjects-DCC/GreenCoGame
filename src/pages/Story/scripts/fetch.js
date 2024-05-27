const backend = process.env.REACT_APP_BACKEND_URL || 'https://greenco.cc.uah.es';

export const getUserProfile = (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/user/profile`, requestOptions)
}

export const getScreenText = (screen_id, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
        screen_id: screen_id,
        language: language,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/loadScreenText`, requestOptions)
}

export const getScreenAssets = (screen_id, planet_id, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let data = {
        screen_id: screen_id,
        planet_id: planet_id,
        language: language,
    }

    data = JSON.stringify(data);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    return fetch(`${backend}/API/screen/loadScreenAssets`, requestOptions)
}

export const getLastScreen = (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/getLastScreenId`, requestOptions)
}

export const getScreenComponents = (screen_id, planet_id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let data = {
        screen_id: screen_id,
    }

    if (planet_id !== null) {
        data.planet_id = planet_id;
    }

    data = JSON.stringify(data);

    const requestOptions = {
        method: 'POST',
        body: data,
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/loadScreenComponents`, requestOptions)
}

export const getComponentQuestions = (component_id, token, difficulty, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        component_id: component_id,
        difficulty: difficulty,
        language: language,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/loadComponentQuestions`, requestOptions)
}

export const getComponentStoryDialogue = (component_id, language, answer_id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
        component_id: component_id,
        language: language,
        answer_id: answer_id,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/loadComponentStoryDialogue`, requestOptions)
}

export const getComponentOptions = (component_id, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
        component_id: component_id,
        language: language,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    return fetch(`${backend}/API/screen/loadComponentOptions`, requestOptions)
}

export const getAwardData = (token, difficulty_id, level_id, planet_id, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        difficulty_id: difficulty_id,
        level_id: level_id,
        planet_id: planet_id,
        language: language,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    return fetch(`${backend}/API/screen/loadAwardData`, requestOptions)
}

export const checkAwardsLevel = (token, difficulty_id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        difficulty_id: difficulty_id
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    return fetch(`${backend}/API/screen/checkAwardsLevel`, requestOptions)
}

export const checkQuestionAnswer = (question_id, answer, difficulty, language, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        question_id: question_id,
        answer: answer,
        difficulty: difficulty,
        language: language,
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/checkQuestionAnswer`, requestOptions)
}

const getNextScreen = (screen_id, difficulty_id, planet_id, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        screen_id: screen_id,
        difficulty_id: difficulty_id,
        planet_id: planet_id,
    })

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/getNextScreen`, requestOptions)
}

export const loadNextScreen = (screen_id, difficulty_id, planet_id, token) => {
    return new Promise((resolve, reject) => {
        getNextScreen(screen_id, difficulty_id, planet_id, token).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    resolve(data);
                })
            } else {
                reject(`Error: ${res.status}`);
            }
        })
            .catch(err => {
                reject(err);
            });
    });
}

export const updateDifficulty = (difficulty, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        difficulty: difficulty,
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/user/difficulty`, requestOptions)
}

export const updatePlanet = (planet, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        planet: planet,
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/user/planet`, requestOptions)
}

export const getUserProfileBrief = (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/user/profile/brief`, requestOptions)
}

export const getUserAward = (token, language) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const data = JSON.stringify({
        language: language,
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };
    return fetch(`${backend}/API/screen/getUserAward`, requestOptions)
}

//Get User Points
export const getUserPoints = (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(`${backend}/API/user/getPoints`, requestOptions)
}