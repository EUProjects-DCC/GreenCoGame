//Returns the formatted text for the component (key->text)
const text_for_component = (text) => {
    formated_text = {}
    for (let i = 0; i < text.length; i++) {
        formated_text[text[i].key] = text[i].text;
    }
    return formated_text;
}

//Returns the formatted text for the component by dividing the text in lines (name->text)
const text_for_story_dialogue = (text) => {
    let newText = [];
    text.forEach(item => {
        const lines = item.text.split(/\r?\n/);
        lines.forEach(line => {
            if (line.trim()) {
                newText.push({
                    name: item.name,
                    text: line
                });
            }
        });
    });
    return newText;
}

//Returns a unified object from an array of objects
const unifyObjects= (data) => {
    let unifiedData = {};
    data.forEach(item => {
        unifiedData[item.name] = item.text;
    });
    return unifiedData;
}


module.exports = {
    text_for_component,
    text_for_story_dialogue,
    unifyObjects
}
