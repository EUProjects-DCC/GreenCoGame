//Get the score of each question regarding the time used to answer. The faster the highest score
const calculateScore = (difficulty, lasted_time) => {
    var score = (difficulty * 10) - (lasted_time/10);
    if(score<difficulty)
    {
        score = difficulty
    }

    return score 
}

module.exports = {
    calculateScore
}