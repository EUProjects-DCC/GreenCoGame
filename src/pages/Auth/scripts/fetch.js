const backend = process.env.REACT_APP_BACKEND_URL || 'https://greenco.cc.uah.es';

//User login
export const checkLogin  = (alias,password) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json"); //Type of the content (JSON)

  const data = JSON.stringify({
    alias: alias,
    password: password,
  });

  const requestOptions = {
      method: 'POST', //Sort of request
      headers: myHeaders, 
      body: data, //Body of the request (JSON) with the user's data
      redirect: 'follow' 
  };

  return fetch(`${backend}/API/auth/login`,requestOptions)
}

// User's sign up
export const checkSignup =  (user) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = JSON.stringify({
    alias: user.alias,
    email: user.email,
    password: user.password,
    birthDate: user.birth_date,
    gender: user.gender,
    country: user.country,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/auth/signup`,requestOptions)
}

// Guet user sign up
export const guestSignup = () => {

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  return fetch(`${backend}/API/auth/signup/guest`,requestOptions)
}

//Check if the email is in use
export const alreadyUsedEmail = (email) => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = JSON.stringify({
    email: email
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/user/checkEmail`,requestOptions)
}

//Check if the alias is in use
export const alreadyUsedAlias = (alias) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
      alias: alias
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow'
    };

    return fetch(`${backend}/API/user/checkAlias`,requestOptions)
}

//Send an email to reset the password
export const sendEmailReset = (email) => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = JSON.stringify({
    email: email,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/auth/reset-password`,requestOptions)
}

//Change the password
export const changePassword = ( password, token ) => {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = JSON.stringify({
    password: password,
    token: token,
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  return fetch(`${backend}/API/auth/reset-password/${token}`,requestOptions)
}