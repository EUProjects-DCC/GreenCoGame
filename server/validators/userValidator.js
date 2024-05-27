email = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ // Minimum eight characters, at least one letter and one number
alias = /^[a-zA-Z0-9_-]{3,16}$/ // Minimum three characters, maximum sixteen characters, letters, numbers, underscores and hyphens
date = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/ // dd/mm/aaaa
gender = /^(Man|Woman|Other)$/ // 
country = /^(es|en|fr|it|bg|ot)$/ // Avaliangle countries
language = /^(1|2|3|4|5)$/ // Available languages (1-Bulgarian, 2-English, 3-Spanish, 4-French, 5-Italian)
difficulty = /^(0|1|2|3)$/ // Availables difficulties (0-Questionaire, 1-Easy, 2-Medium, 3-Hard)
planet = /^(1|2)$/ // PAvailable planets (1-Earth, 2-Mars)

module.exports = {
    email,
    password,
    alias,
    date,
    gender,
    country,
    difficulty,
    planet,
    language
}