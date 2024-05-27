// Gets the screens of a level
const screens_for_level = `
    SELECT
        ROW_NUMBER() OVER (ORDER BY ls.screen_id) AS indice,
        ls.screen_id as screen_id,
    FROM level_screen ls
        JOIN screen s ON ls.screen_id = s.id
    WHERE ls.level_id = ? AND ls.planet_id = ? AND s.name NOT LIKE '%LearningPill%'
    ORDER BY ls.screen_id;
`;

// Gets the text from an empty screen
const text_for_null_screen = `
    SELECT t.text, t.key
    FROM screen_text st
    JOIN text t ON st.text_id = t.id
    WHERE st.screen_id is null AND t.language_id = ?;
`;

// Gets the text of a screen
const text_for_screen = `
    SELECT t.text, t.key
    FROM screen_text st
    JOIN text t ON st.text_id = t.id
    WHERE st.screen_id = ? AND t.language_id = ?;
`;

// Gets the assets of a screen (background, images and alternative text)
const assets_for_screen = `
    SELECT DISTINCT a.path AS path , t.text AS text, t.key AS name, s.background AS background
    FROM screen s
        JOIN screen_assets sa ON s.id
        JOIN assets a ON sa.assets_id = a.id
        LEFT JOIN text t ON a.alt = t.id
    WHERE sa.screen_id = ? AND sa.planet_id = ? AND t.language_id = ?
    GROUP BY t.key;
`;

// Gets the assets of a screen (background)
const background_for_screen = `
    SELECT a.path as url
    FROM screen s
        JOIN assets a ON a.id = s.background
    WHERE s.id = ? AND (s.planet_id is NULL OR s.planet_id = ?);
`;

// Obtains the components of a screen
const components_for_screen = `
    SELECT sc.id, c.type
    FROM screen s
        JOIN screen_component sc ON sc.screen_id = s.id
        JOIN component c ON sc.component_id = c.id
    WHERE s.id = ? AND (sc.planet_id is NULL OR sc.planet_id = ?);
`

// Logs the start of a question (start date, user id and question id).
const start_answering_question = `
    INSERT INTO
        user_question(user_id, question_id, start_date)
    VALUES
        (?, ?, NOW());
`;

// Records the end of a question (date of completion, answer and correctness).
const end_answering_question = `
    UPDATE
        user_question
    SET
        end_date = NOW(),
        answer = ?,
        correct = ?
    WHERE
        user_id = ? AND question_id = ? AND start_date = (
            SELECT MAX(start_date)
            FROM user_question
            WHERE user_id = ? AND question_id = ?
        );
`;

// Gets the questions of a component
const questions_for_component = `
    SELECT
        q.id as question_id,
        q.answer_id as answer_id,
        q.lower_limit as lower_limit,
        q.upper_limit as upper_limit,
        q.description
    FROM screen_component sc
        JOIN question q ON sc.question_id = q.id
    WHERE sc.id = ? AND q.difficulty_id <= ?;

`;

// Gets the text of a question
const text_for_question = `
    SELECT DISTINCT t.text, t.key
    FROM question q
        JOIN question_answer_text qat ON qat.question_id = q.id
        LEFT JOIN answer at ON at.id = q.answer_id
        JOIN text t ON qat.text_id = t.id
    WHERE q.id = ? AND qat.answer_id = ? AND t.language_id = ?;
`;


// Gets the text of a story component as well as the name of the character who says it (if any).
const story_dialogue_for_component = `
    SELECT mc.name, t.text
    FROM story_dialogue sd
        LEFT JOIN main_character mc ON mc.id = sd.character_id
        JOIN story_dialogue sdt ON sdt.id = sd.id
        JOIN text t ON sdt.text_id = t.id
    WHERE sd.component_id = ? AND t.language_id = ? AND (sd.answer_id = ? OR sd.answer_id IS NULL)
`;

// Gets the options of a component (paths to assets)
const options_for_component = `
SELECT distinct a.path AS src, co.method, co.value, t.text
FROM choose_option co
         JOIN assets a ON co.asset_id = a.id
         JOIN text t on a.text_id=t.id
WHERE co.component_id = ? and t.language_id=?;
`;

// Gets the valid answers to a question
const question_valid_answers = `
    SELECT t.text
    FROM question q
        JOIN answer at ON q.answer_id = at.id
        JOIN text t ON t.id = at.text_id
    WHERE q.id = ? AND language_id = ?;
`;

// You get the following screen that can be accessed from the current screen
const next_screen = `
    SELECT screen.id as screen_id, screen.is_static, screen.url FROM screen_transition, screen    
    WHERE screen_transition.to_screen=screen.id AND 
    screen_transition.from_screen=? AND (screen_transition.difficulty_id=0 OR screen_transition.difficulty_id=?);

`;

// Updates the last screen accessed by the user.
const update_last_screen = `
    UPDATE user
    SET last_screen = ?
    WHERE id = ?;
`;

// Gets the error message of a display in a given language
const get_error_message = `
SELECT text.text
FROM error, text
WHERE error.type = ? AND text.language_id = ? AND error.text_id=text.id;
`;

// Gets the trophy list of a user.
const get_user_award = `
SELECT award_type.*, user_award.difficulty, text.text
    FROM user_award, award_type,text
    WHERE award_type.id=user_award.award_type_id AND award_type.id=award_type.id AND award_type.text_id=text.id
    AND user_award.user_id=? AND text.language_id=?;
`;
// Gets the trophy list of a user.
const get_award = `
SELECT award_type.*, text.text
    FROM award_type,text
    WHERE  award_type.id=award_type.id AND award_type.text_id=text.id
    AND text.language_id=? and level_id=? and planet_id=?;
`;


// Gets the options of a component (paths to assets)
const getAwardsUserLevel = `
SELECT * FROM greenco.user_award,award_type WHERE user_id=? AND difficulty=? AND award_type.id=award_type_id;
`;

module.exports = {
    screens_for_level,
    text_for_screen,
    background_for_screen,
    components_for_screen,
    questions_for_component,
    text_for_question,
    story_dialogue_for_component,
    options_for_component,
    question_valid_answers,
    next_screen,
    update_last_screen,
    start_answering_question,
    end_answering_question,
    get_error_message,
    assets_for_screen,
    get_user_award, 
    text_for_null_screen, 
    getAwardsUserLevel
}
