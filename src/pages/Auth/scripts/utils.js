
//Check the password inserted by the user (at least 8 characters, one letter and one number)
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return regex.test(password)
};

//Check the emain inserted by the user (must have a valid format)
const validateEmail = (email) => {
    const regex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return regex.test(email)
}

//Checks the validity of the alias entered by the user (minimum 3 characters, maximum 16 characters, letters, numbers, hyphens and underscores)
const validateAlias = (alias) => {
    const regex = /^[a-zA-Z0-9_-]{3,16}$/
    return regex.test(alias)
}

//Checks the validity of the date of birth entered by the user (dd/mm/yyyy)
const validateBirthDate = (date) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    return regex.test(date)
}

//Checks the validity of the gender entered by the user (Male, Female or Other)
const validateGender = (gender) => {
    const regex = /^(Man|Woman|Other)$/
    return regex.test(gender)
}

//Checks the validity of the country entered by the user (Spain, England, France, Italy, Bulgary or Other)
const validateCountry = (country) => {
    const regex =/^(en|es|fr|bg|it|ot)$/
    return regex.test(country)
}

//Method that validates the data entered by the user in the registration form
const validateData = (user, password2) => {
    let errors = []
    for(let key in user){
        switch(key){
            case "email":
                errors.push(!validateEmail(user.email))
                break
            case "password":
                errors.push(!validatePassword(user.password))
                break
            case "alias":
                errors.push(!validateAlias(user.alias))
                break
            case "birth_date":
                errors.push(!validateBirthDate(user.birth_date))
                break
            case "country":
                errors.push(!validateCountry(user.country))
                break
            case "gender":
                errors.push(!validateGender(user.gender))
                break
            default:
                break
        }
    }
    errors[7] = (user.password !== password2)
    return errors
}

const errorHandler = (errors, setErrors) => {
    setErrors(errors)
}

//Method that calculates the user's age from his/her date of birth
const getAge = (date, setAge, setBirthDate) => {
    
    if(isValidDate(date)){
        let today = new Date();
        let birthDate = toDate(date)
        var age = Number(Number(today.getFullYear()) - Number(birthDate.getFullYear()));
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setAge(age)
        if(age>=16)
        {
            setBirthDate(date)
        } 
        return true
    }
    else{
        return false
    }
}
function toDate(date) {
    var from = date.split("/")
    return new Date(from[2], from[1] - 1, from[0])
  }

//Methods displaying error and success messages
const showErrorMessage = (message,cssClass, buttons) => {
    return {
        message: message,
        duration: 6000,
        cssClass: cssClass,
        buttons: [buttons]
    }
}

const showSuccessMessage = (message,cssClass, buttons) => {
    return {
        message: message,
        duration: 6000,
        cssClass: cssClass,
        buttons: [buttons]
    }
}

//cookies (withou use)
const setCookie = (name, value, days) => {

    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/" ;
}

const getCookie = (name) => {

    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const eraseCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

module.exports = { 
    validateData,getAge, 
    showErrorMessage, 
    showSuccessMessage, 
    errorHandler,
    validateAlias, 
    validateBirthDate, 
    validateCountry, 
    validateEmail, 
    validateGender, 
    validatePassword,
    setCookie, 
    getCookie, 
    eraseCookie }
