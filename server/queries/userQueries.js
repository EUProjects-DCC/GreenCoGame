// Gets the last screen visited by the user.
get_last_screen = `
    SELECT u.last_screen,s.is_static, s.url
    FROM user u
    JOIN screen s ON u.last_screen = s.id
    WHERE u.id = ?;
`

// Updates the last screen visited by the user.
updateLastScreen = `
    UPDATE user
    SET last_screen = ?
    WHERE user.id = ?;
`

// Gets the last user id of the user registered as a guest.
last_guest_id = `
    SELECT MAX(id) as id
    FROM user;
`

// Obtains the world ranking
get_world_ranking = `
    SELECT avatar, alias, points
    FROM user
    ORDER BY points DESC, id ASC
    LIMIT ? OFFSET ?;
`

// Gets the local ranking (by country)
get_local_ranking =
`
    SELECT avatar, alias, points
    FROM user
    WHERE user.country_id = ?
    ORDER BY points DESC, id ASC
    LIMIT ? OFFSET ?;
`

// Gets a user's position in the world ranking
get_world_position = `
    SELECT position, avatar, alias, points
    FROM (
        SELECT RANK() OVER (ORDER BY points DESC, id ASC) AS position,
            id, avatar, alias, points
        FROM user
    ) AS ranked_users
    WHERE id = ?;
`

// Updates the difficulty of a user
update_difficulty = `
    UPDATE user
    SET difficulty_id = ?
    WHERE user.id = ?;
`

// Update a user's planet
update_planet = `
    UPDATE user
    SET planet_id = ?
    WHERE user.id = ?;
`

// Obtains a user's profile (basic data)
get_user_profile_brief = `
    SELECT alias, avatar, difficulty_id, planet_id, points
    FROM user
    WHERE user.id = ?;
`;

// Check if a user has already answered a question correctly so as not to increase the score.
check_answered_correctly = `
    SELECT COALESCE(COUNT(*), 0) AS times_answered_correctly
    FROM user_question uq
    WHERE uq.user_id = ? AND uq.question_id = ? AND uq.correct
`;

start_date_question = `
    SELECT uq.start_date
    FROM user_question uq
    WHERE uq.user_id = ? AND uq.question_id = ?
    ORDER BY uq.start_date DESC
    LIMIT 1;
`;


//Get the Points of a User
get_user_points = `
    SELECT points
    FROM user
    WHERE user.id = ?;
`

// Update user's score
update_score = `
    UPDATE user
        SET points = points + ?
    WHERE user.id = ?;
`;

// Checks if a user already has a specific achievement
check_user_award = `
select COUNT(*) AS count, difficulty as difficulty, award_type_id as award_id
    FROM user_award, award_type
    WHERE award_type.id=award_type_id and user_id=? AND difficulty = ? and level_id=? and planet_id=?;
`;

// Record an achievement for a user
give_user_award = `
INSERT INTO user_award (user_id, award_type_id, difficulty)
    VALUES (?, (SELECT id FROM award_type where level_id=? and planet_id=?), ? )ON DUPLICATE KEY UPDATE user_id=?;
`;

// Updates the difficulty of an achievement for a user
update_award_difficulty = `
UPDATE user_award
SET difficulty = ?
WHERE user_id=? and award_type_id=?;
`;

// Gets the information of an achievement (to display it on screen)
get_award_data = `
SELECT text.key AS name, text.text AS text
FROM difficulty, text 
WHERE difficulty.id = ? AND text.id=difficulty.text_id AND language_id=?
UNION   
SELECT text.key AS name, text.text AS text
FROM level, text
WHERE level.id = ? AND text.id=level.text_id AND language_id=?
UNION
SELECT text.key AS name, text.text AS text
FROM planet, text
WHERE planet.id = ? AND text.id=planet.text_id AND language_id=?;
`;

module.exports = {
    get_last_screen,
    last_guest_id,
    get_user_profile_brief,
    get_world_position,
    get_world_ranking,
    get_local_ranking,
    updateLastScreen,
    update_difficulty,
    update_planet,
    start_date_question,
    check_answered_correctly,
    update_score,
    check_user_award,
    give_user_award,
    update_award_difficulty,
    get_award_data, 
    get_user_points
}
