const backend = process.env.REACT_APP_BACKEND_URL || 'https://greenco.cc.uah.es';

//Obtains a ranking of users based on the type of ranking and the page.
export const getRanking  = (type,page,token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const data = JSON.stringify({
    page: page,
    limit: 10,
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/user/ranking/${type}?page=${page}&limit=10`,requestOptions)
}

//Obtains the position of a user in a ranking according to the type of ranking.
export const getUserTop = (type, token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/user/ranking/${type}`,requestOptions)
}

//Obtains paths to avatar images
export const getAvatars = (token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/assets/avatar`,requestOptions)

}

//Update the email and password of a user
export const updateProfile = (email, password, token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const data = JSON.stringify({
    email: email,
    password: password,
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/user/profile`,requestOptions)
}

//Update user's avatar
export const updateAvatar = (avatar, token) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const data = JSON.stringify({
    avatar: avatar,
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/user/avatar`,requestOptions)
}