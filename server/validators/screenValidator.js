question_difficulty = /^(0|1|2|3)$/ // 0: questionnaire, 1: easy, 2: medium, 3: hard
error_code = /^(400|401|403|404|408|500|502|503|504)$/ // HTTP error codes
level = /^(1|2|3|4)$/ // Ids of the levels (each section of questions)

// Valida que la respuesta del usuario sea una de las posibles respuestas
const validateAnswers = (user_answer, posible_answers) => {
    /*
    * 1. Check that the user's answer is one of the possible answers.
    * 2. Return true if correct, false if not correct
    */
    let correct = false;
    for(let i=0; i<posible_answers.length; i++){
        if(user_answer.replace(" ","") === posible_answers[i].replace(" ","")){
          correct = true;
          break;
        }
    }
    return correct;
}

module.exports = {
    question_difficulty,
    error_code,
    level,
    validateAnswers
}
