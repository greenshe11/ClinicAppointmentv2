import {getSession} from '/static/pageScripts/session.js'
export async function fetchSymptomsRef(filter) {
    const url = "/api/symptomsref" + filter?"?"+filter:""
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Or whatever content type you expect
          // Add other headers as needed (e.g., authorization)
        },
      });
  
      if (!response.ok) {
        // Handle non-2xx HTTP status codes
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Or response.text() for plain text, etc.
      return data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error fetching data:', error);
      return null; // Or throw the error, or return an empty object, etc.
    }
  }
  
export function removeFrontBackSpaces(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

export const symptomsRef = {
    getSymptomNameLevels: async (symptomName) => {
        const symptomNameTrimmed = removeFrontBackSpaces(symptomName)
        const fetchedSymptomNameData = await fetchSymptomsRef(`SymptomsRef_Name=${symptomName}`)
        const levels = []
        for (let index in fetchedSymptomNameData){
            const targetSymptomNameData = fetchedSymptomNameData[index]
            levels.append(targetSymptomNameData["SymptomsRef_Level"])
        }
        return levels

    }
}

  
// when adding symptom: recommendation, start at bottom to avoid messing with code name -> symptom conversion
export const mildSymptoms = {
    "Fever (37.8 C-39 C)": "Stay hydrated and rest. Use light clothing. Consider over-the-counter medication like acetaminophen or ibuprofen for discomfort",
    "Fever (39 C-40 C)": "Stay hydrated and rest. Use light clothing. Consider over-the-counter medication like acetaminophen or ibuprofen for discomfort",
    "Dengue Fever (mild)": "Rest, stay hydrated, and take paracetamol to reduce fever. Avoid aspirin and ibuprofen",
    "Rheumatic Fever (mild)": "Get plenty of rest. Stay hydrated and eat nutritious meals.",
    "Hay Fever (mild)": "Use saline nasal spray. Stay hydrated and avoid allergens",
    "Headache (mild)": "Rest in a quiet, dark room. Use a cold compress or gentle massage.",
    "Sinus Headache (mild)": "Use a warm compress and stay hydrated. Try steam inhalation to relieve pressure",
    "Tension-Type Headache (mild)": "Rest in a quiet, dark room. Use a cold compress or gentle massage",
    "Tension-Type Headache (severe)": "Stay in a cool, ventilated area and avoid strong odors",
    "Fever, sweating, and shaking c (mild)": "Use fever reducers like acetaminophen or ibuprofen if needed",
    "Chills and shivering (mild)": "Use a warm blanket. Drink warm fluids",
    "Slight fever and chills (mild)": "Monitor temperature; stay hydrated and rest",
    "Mild muscle aches (mild)": "Rest, stay hydrated, and consider warm compresses",
    "Loss of appetite (mild)": "Eat small, nutritious meals. Drink fluids like broth or juice",
    "Irritability (mild)": "Ensure rest and hydration. Try relaxation techniques",
    "General weakness (mild)": "Drink fluids, rest, and avoid strenuous activity",
    "Mild dehydration (mild)": "Increase fluid intake. Drink water or oral rehydration solution",
    "Mild muscle aches (mild)": "Rest, stay hydrated, and consider warm compresses",
    "Sore throat (mild discomfort) (mild)": "Drink warm fluids, avoid acidic drinks, and use honey for relief",
    "Mild nausea without vomiting (mild)": "Sip ginger tea or stay hydrated",
    "Mild vomiting (mild)": "Take small sips of fluids and avoid solid foods temporarily",
    "Dizzy or lightheaded feelings (mild)": "Sit or lie down immediately. Stay hydrated and avoid standing up too quickly",
    "Fatigue (mild)": "Rest and maintain a balanced diet. Monitor hydration and salt intake",
    "Trouble concentrating (mild)": "Take breaks, drink water, and eat small frequent meals",
    "Upset stomach (mild)": "Eat light, bland foods and drink fluids. Avoid sudden posture changes.",
    "Dull, aching head pain (mild)": "Rest in a quiet, dark room. Use a cold compress or gentle massage",
    "Feeling of tightness or pressure a (mild)": "Practice relaxation techniques like deep breathing and neck stretches",
    "Tenderness in the scalp, neck, anc (mild.)": "Apply heat packs to tense muscles and try gentle stretching exercises",
    "Mild ear pain, especially when lyir (mild)": "Use a warm compress and over-the-counter pain relievers",
    "tugging or pulling at an ear (mild)": "Monitor for worsening symptoms and keep the ear dry.",
    "Trouble sleeping (mild)": "Try a comfortable sleeping position and pain relief methods",
    "Crying more than usual (mild)": "Soothe with gentle rocking and ensure hydration.",
    "Fussiness (mild)": "Provide comfort and monitor for fever or worsening pain.",
    "Mild trouble hearing or respondin (mild.)": "Monitor symptoms and avoid loud noises",
    "Runny nose (moderate)": "Use saline nasal spray. Stay hydrated",
    "Cough (mild)": "Stay hydrated and use honey or lozenges to soothe the throat",
    "Sneezing and cough (mild)": "Take antihistamines. Avoid allergen exposure",
    "Mild diarrhea (without blood) (mild)": "Stay hydrated and eat bland foods like toast, bananas, or rice",
    "Mild rash (mild)": "Keep skin cool and wear loose clothing to reduce irritation",
    "Neck stiffness (mild)": "Apply heat or perform gentle neck stretches",
    "Increased urination (mild)": "Ensure proper hydration and monitor for dehydration",
    "Loss of appetite (mild)": "Offer soft foods and ensure hydration"
  };
  
export const heavySymptoms = {
    "Fever (greater than 40 C)": "Seek immediate medical attention.",
    "Dengue Fever (moderate)": "Stay hydrated and rest in a dark, quiet room,",
    "Dengue Fever (severe)": "Use saline nasal spray. Stay hydrated and avoid allergens",
    "Rheumatic Fever (moderate)": "Rest and avoid physical exertion. If pain worsens, seek medical advice",
    "Rheumatic Fever (severe)": "Seek urgent care. Could indicate nervous system involvement.",
    "Hay Fever (moderate)": "Take antihistamines or decongestants as needed.",
    "Hay Fever (severe)": "Consult a doctor for sinusitis evaluation",
    "Headache (moderate)": "Try over-the-counter pain relievers like ibuprofen..",
    "Headache (severe)": "Seek emergency care immediately",
    "Sinus Headache (moderate)": "Try steam inhalation. Monitor symptoms and consult a doctor if prolonged",
    "Sinus Headache (severe)": "Seek medical attention for further assessment",
    "Tension-Type Headache (moderate)": "Try stress management techniques and over-the-counter pain relievers if necessary",
    "Fever, sweating, and shaking c (moderate)": "Monitor and seek medical attention if persistent",
    "Chills and shivering (severe)": "Seek urgent medical evaluation",
    "Shaking and chills (severe)": "Seek urgent medical evaluation",
    "Moderate muscle aches (moderate)": "Use a warm compress. Take pain relievers if necessary",
    "Fatigue or weakness (moderate)": "Ensure proper rest and hydration",
    "Fatigue or weakness (severe)": "Could indicate internal bleeding. Get urgent medical attention",
    "Neurological symptoms (weakr (severe)": "Seek emergency medical care",
    "Extreme weakness, fatigue, or (moderae)": "Consult a healthcare provider to check for underlying conditions",
    "Severe dehydration (no urine, (severe)": "Seek emergency medical care immediately",
    "Muscle weakness or loss of mc (severe)": "Seek immediate medical care for possible neurological effects",
    "Moderate muscle aches (moderate)": "Use a warm compress. Take pain relievers if necessary",
    "Sore throat that comes on sudo (moderate)": "Drink warm fluids. Gargle salt water. Take pain relievers if needed",
    "Severe sore throat with difficult severe": "Seek urgent care for possible bacterial infection",
    "Recurring sore throats (moderate)": "Consult a healthcare provider for underlying causes",
    "Sore throat lasting more than 4 (moderate)": "Seek medical attention for further evaluation",
    "Stomachache (moderate)": "Avoid solid foods. Drink small sips of clear fluids",
    "Vomiting (Occasional) (moderate)": "Drink fluids in small amounts. Avoid solid foods until vomiting stops",
    "Persistent vomiting (severe)": "Dehydration risk is high. Seek medical attention",
    "Frequent vomiting (moderate)": "Drink electrolyte solutions and monitor hydration levels",
    "Moderate nausea with occasio (moderate)": "Stay hydrated and eat small meals",
    "Frequent nausea or vomiting (moderate.)": "Monitor symptoms and seek medical advice if persistent",
    "Vomiting and unable to hold do severe (severe)": "Get medical attention urgently to prevent dehydration",
    "Vomiting blood (severe)": "Seek immediate medical attention as it may indicate internal bleeding",
    "Ongoing vomiting with dizzines (severe)": "Seek urgent medical attention",
    "Episodic tension-type headache la (moderate)": "Try stress management techniques and over-the-counter pain relievers if necessary.",
    "Frequent episodic tension-type he (moderate)": "Keep a headache diary and consult a doctor if symptoms persist",
    "Chronic tension-type headache (la (moderate)": "Consider professional treatment options such as physical therapy or stress management.",
    "Sudden, severe headache (Thundi (severe)": "Seek emergency care immediately",
    "Headache with fever, stiff neck,  (severe)": "Seek urgent medical attention",
    "Headache after a head injury (severe)": "Consult a doctor immediately",
    "Neurological symptoms (weaknes (severe)": "Seek emergency medical care",
    "Frequent migraines interfering wi (severe)": "Consider specialized treatment from a neurologist",
    "Fever of 100 F (38 C) or higher (moderate)": "Use fever-reducing medication like acetaminophen or ibuprofen, and ensure hydration.",
    "Drainage of clear or slightly cloud (moderate)": "Keep the ear dry and monitor for worsening discharge",
    "Headache (moderate)": "Use a cold compress and ensure proper rest",
    "Noticeable trouble hearing (moderate)": "Avoid exposure to loud noises and monitor changes",
    "Loss of balance (moderate)": "Ensure a safe environment and monitor for persistent issues",
    "Runny nose (moderate)": "Use saline nasal spray. Stay hydrated",
    "Cough lasting for weeks, distur (moderate)": "Schedule a doctor's appointment to determine the cause",
    "Coughing up blood (severe)": "Seek emergency medical care immediately",
    "Persistent cough lasting sever severe": "Consult a doctor to rule out infections or underlying conditions",
    "Cough with significant breathin severe": "Call emergency services for urgent evaluation",
    "Chest pain when you breathe  (moderate)": "Rest and take over-the-counter pain relievers. Seek medical advice if it worsens",
    "Watery, nonbloody diarrhea (moderate)": "Stay hydrated with water, clear broths, or electrolyte solutions",
    "Diarrhea or vomiting lasting mc (moderate)": "Consult a doctor to assess for dehydration and infections",
    "Diarrhea with blood or pus (moderate)": "Consult a doctor immediately to check for bacterial infection",
    "Diarrhea lasting more than one (moderate)": "Medical evaluation is recommended",
    "Listlessness (Child appears siu (moderate)": "Ensure hydration and rest. Monitor for worsening symptoms",
    "Worsening rash (moderate)": "Monitor if rash spreads or changes. Keep skin cool",
    "Sensitivity to light or noise (mild)": "Reduce screen time and stay in a dimly lit environmen",
    "Severe light sensitivity (severe)": "Seek urgent care to rule out serious eye conditions",
    "Stiff neck and pain when bendi (severe)": "Go to the ER immediately. Could be a sign of meningitis",
    "Neck stiffness (mild)": "Apply heat or perform gentle neck stretches",
    "Swelling in the neck or face (severe)": "May indicate a serious infection-go to the emergency room",
    "Stiffness in the body and neck (severe)": "Seek urgent medical evaluation",
    "Mental confusion, strange beha (severe)": "Call emergency services immediately",
    "Severe drowsiness or confusio (severe)": "Call emergency services immediately",
    "Post-migraine exhaustion, coní (moderate)": "Get adequate rest and stay hydrated",
    "Pain when urinating (severe)": "May be a sign of infection. Seek medical consultation",
    "Strong urge to urinate frequent (moderate)": "Drink water and consult a doctor if symptoms persist",
    "Urine that appears cloudy (moderate)": "Stay hydrated and seek medical advice",
    "Urine that is red, bright pink, or (moderate)": "Consult a healthcare provider immediately",
    "Strong-smelling urine (moderate)": "Increase fluid intake and seek medical advice if the odor persists",
    "Lower belly discomfort or blade (moderate)": "Rest and consult a doctor if pain worsens",
    "Presence of ketones in the urir (severe)": "Seek immediate medical care as this indicates insufficient insulin levels",
    "Difficulty breathing or chest pai (severe)": "Seek emergency care immediately",
    "Mild breathing difficulties (due (moderate)": "Practice steam inhalation. Use antihistamines or decongestants",
    "Trouble breathing along with di (severe)": "Seek emergency care immediately",
    "Rapid, shallow breathing (severe)": "Call emergency services immediately",
    "Rapid breathing or feeling like (moderate)": "Practice slow, deep breathing. Avoid enclosed spaces",
    "Wheezing (whistling sound whi (moderate)": "Use prescribed bronchodilators and avoid lung irritants",
    "Severe difficulty breathing (severe)": "Seek emergency medical care immediately"
  };

const getKeyInitial = (array, index) => {
    const key = Object.keys(array)[index]
    const first = key.split('(')[0]
    return first
}

export const mildSymptomsKeysInitial = () => {
    const list = []
    for (let i=0; i<Object.keys(mildSymptoms).length; i++){
        list.push(getKeyInitial(mildSymptoms, i))
    }
    return list
}

export const heavySymptomsKeysInitial = () => {
    const list = []
    for (let i=0; i<Object.keys(heavySymptoms).length; i++){
        list.push(getKeyInitial(heavySymptoms, i))
    }
    return list
}
const getLevels = (array, severity) => {
    const pairs = {}
    let symptomsInitialKeys = []
    if (severity=='mild'){
        symptomsInitialKeys = mildSymptomsKeysInitial()
    }else{
        symptomsInitialKeys = heavySymptomsKeysInitial()
    }

    const getLevelName = (name) => {
        const res =  name.match(/\(([^)]+)\)/g)
        return res?res[0]:''
    }

    for (let index in symptomsInitialKeys){
        pairs[symptomsInitialKeys[index]] = []
        for (let key in array){
            if (symptomsInitialKeys[index] == key.split('(')[0]){
                pairs[symptomsInitialKeys[index]].push(getLevelName(key))
                
            }
        }
    }
    return pairs

}

export const mildSymptomsLevels = getLevels(mildSymptoms, 'mild')
export const heavySymptomsLevels = getLevels(heavySymptoms, 'heavy')



const getSymptomCodes = ()=>{
    const tempList = {}
    for (let i=0; i<Object.keys(mildSymptoms).length; i++){
        tempList[`a${i}`] = Object.keys(mildSymptoms)[i]
    }
    for (let i=0; i<Object.keys(heavySymptoms).length; i++){
        tempList[`b${i}`] = Object.keys(heavySymptoms)[i]
    }
    tempList['o'] = '... others'
    console.log('templist',tempList)
    return tempList
}

export const symptomCodes = getSymptomCodes()

export const getSymptomFromCode = (code) => {
    
    const isNotOther = Object.keys(symptomCodes).includes(code)
    if (isNotOther){
        return symptomCodes[code]
    }else{
        return '... others'
    }
}

export const getSymptomsFromStringArray = (string) => {
    const arr = string.split(','); // Split the input string into an array
    const res = arr.map((value) => { // Use map to transform each value
        return getSymptomFromCode(value.trim()); // Call the function and trim whitespace
    });
    return res; // Return the resulting array
};

// Function to get a recommendation based on a symptom input
export const getRecommendation = (symptom) => {
    // Check if the symptom exists as a key in the mildSymptoms object
    if (Object.keys(mildSymptoms).includes(symptom)) { 
        return mildSymptoms[symptom]; // Return the corresponding recommendation from mildSymptoms
    // Check if the symptom exists as a key in the heavySymptoms object
    } else if (Object.keys(heavySymptoms).includes(symptom)) { 
        return heavySymptoms[symptom]; // Return the corresponding recommendation from heavySymptoms
    } else {
        return false; // If the symptom is not found in either object, return false
    }
};  

/**
 * Converts an array of symptom codes into an array of corresponding symptom descriptions.
 * 
 * @param {Array} arr - An array of symptom codes that need to be converted.
 * 
 * @returns {Array} - An array of symptom descriptions corresponding to the input codes.
 * 
 * Example usage:
 * const symptomCodes = ['C1', 'C2', 'C3'];
 * const symptoms = getSymptomsFromCodeArray(symptomCodes);
 * console.log(symptoms); // ['Headache', 'Fever', 'Cough']
 */
export const getSymptomsFromCodeArray = (arr) => {
    const temp = []
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        const code = arr[i]
        temp.push(getSymptomFromCode(code))
    }
    console.log(temp)
    return temp
}
export const createCustomRecommendationFromCode = async (symptomArray, symptomData) => {
    let isStaff = false
    const session = await getSession()

    //Hiding the account icon if it is not logged in
    if (typeof session['isStaff'] != 'undefined' && session["isStaff"]) {
      isStaff = true
   
    }
    console.log("SESSION", session)
    console.log("creating recommendaiton", symptomArray, symptomData)
    
    let sentence = ''; // Initialize an empty string to hold the final recommendation sentence
    for (let i = 0; i < symptomArray.length; i++) { // Loop through each symptom in the symptomArray
        let symptom = symptomArray[i]; // Get the current symptom from the array
        console.log("SYM", symptom)
        const symptomId = symptomData[i].Symptoms_ID
        console.log(symptomId)
        let customSymptomsData = (await(await fetch(`/api/customsymptoms?Symptoms_ID=${symptomId}`)).json())[0]
        let symptomsData = (await (await fetch(`/api/symptoms?Symptoms_ID=${symptomId}`)).json())[0]
        console.log(customSymptomsData)
        console.log(symptomsData)
        const elementId = `${customSymptomsData.CustomSymptoms_ID}-${symptomId}-textarea-${symptom}`
        const btnId = `${customSymptomsData.CustomSymptoms_ID}-${symptomId}-btn-${symptom}`
        const textArea = `<textarea oninput="document.getElementById('${btnId}').disabled = false" style="width:100%; min-height: 100px;" id="${elementId}">${customSymptomsData.CustomSymptoms_DiagnosisInfo}</textarea>`
        if (symptomArray[i] == "00"){
            if (isStaff){
                
                sentence = sentence + `<div style="display: flex;flex-direction: row; align-items: flex-start; width: 100%">
                    <div style="width: 25%; padding-right: 5px;">By selecting <u>... Others</u>:</div>
                    <div style="width: 50%;">${textArea}</div>
                    <div style="width:25%;padding-left:10px; padding-right:10px; align-items:flex-start">
                        <button disabled id="${btnId}" style="width:100%" class="btn btn-primary" onclick="updateCustomSymptom('${customSymptomsData.CustomSymptoms_ID}','${elementId}', '${btnId}')">Update</button>
                    </div>
                </div>`
            
            }else{
                sentence = sentence + `<br>For <u>... others</u>: ${customSymptomsData.CustomSymptoms_DiagnosisInfo} <br>`; // Format it and append it to the temp string
            }
            continue
        }
        
        let temp = ''; // Initialize a temporary string to hold the recommendation for the current symptom
        let data = (await (await fetch(`/api/symptomsref?SymptomsRef_ID=${symptom}`)).json())[0]
        let recommendation = data["SymptomsRef_Recommendation"]
        let name = '<span style="white-space: pre-line">' + data["SymptomsRef_Name"] + "(" + data["SymptomsRef_Level"] + ")</span>"
        
        if (recommendation) { // If a recommendation exists
            recommendation = recommendation
            if (!isStaff){

                temp = `<br>For <u>${name}</u>: ${customSymptomsData.CustomSymptoms_DiagnosisInfo} <br>`; // Format it and append it to the temp string
            }else{
                temp = `<div style="display: flex;flex-direction: row; align-items: flex-start; width: 100%">
                    <div style="width: 25%; padding-right: 5px;">For <u>${name}</u>:</div>
                    <div style="width: 50%;">${textArea}</div>
                    <div style="width:25%;padding-left:10px; padding-right:10px; align-items:flex-start">
                        <button disabled  id="${btnId}" style="width:100%" class="btn btn-primary" onclick="updateCustomSymptom('${customSymptomsData.CustomSymptoms_ID}','${elementId}', '${btnId}')">Update</button>
                    </div>
                </div>`
            }
        }
        sentence = sentence + temp; // Append the temp string to the final sentence
    }
    return sentence; // Return the complete recommendation sentence
}

export const createRecommendationSentFromCode = async (symptomArray) => {
    console.log("creating recommendaiton", symptomArray)
    let sentence = ''; // Initialize an empty string to hold the final recommendation sentence
    for (let i = 0; i < symptomArray.length; i++) { // Loop through each symptom in the symptomArray
        if (symptomArray[i] == "00"){
            sentence = sentence + `<br>By selecting <u>... Others</u>, you indicate that you are unsure of what you feel or that none of the choices above apply. In this case, consulting a proper health care provider is recommended. </br>`
            continue
        }
        let symptom = symptomArray[i]; // Get the current symptom from the array
        let temp = ''; // Initialize a temporary string to hold the recommendation for the current symptom
        let data = (await (await fetch(`/api/symptomsref?SymptomsRef_ID=${symptom}`)).json())[0]
        let recommendation = data["SymptomsRef_Recommendation"]
        let name = '<span style="white-space: pre-line">' + data["SymptomsRef_Name"] + "(" + data["SymptomsRef_Level"] + ")</span>"
        if (recommendation) { // If a recommendation exists
            recommendation = recommendation
            temp = `<br>For <u>${name}</u>: ${recommendation} <br>`; // Format it and append it to the temp string
        }
        sentence = sentence + temp; // Append the temp string to the final sentence
    }
    return sentence; // Return the complete recommendation sentence
}
// Function to create a recommendation sentence from an array of symptoms
export const createRecommendationSent = (symptomArray) => {
    let sentence = ''; // Initialize an empty string to hold the final recommendation sentence
    for (let i = 0; i < symptomArray.length; i++) { // Loop through each symptom in the symptomArray
        let symptom = symptomArray[i]; // Get the current symptom from the array
        let temp = ''; // Initialize a temporary string to hold the recommendation for the current symptom
        let recommendation = getRecommendation(symptom); // Get the recommendation for the current symptom
        if (recommendation) { // If a recommendation exists
            recommendation = recommendation
            temp = `For <u>${symptomArray[i]}</u>: ${recommendation} <br>`; // Format it and append it to the temp string
        }
        sentence = sentence + temp; // Append the temp string to the final sentence
    }
    return sentence; // Return the complete recommendation sentence
};

// Function to determine if a symptom is serious based on its presence in symptom categories
export const isSeriousSymptom = (symptom) => {
    // Check if the symptom exists as a key in the mildSymptoms object
    if (Object.keys(mildSymptoms).includes(symptom)) { 
        return false; // Return false if the symptom is classified as mild
    // Check if the symptom exists as a key in the heavySymptoms object
    } else if (Object.keys(heavySymptoms).includes(symptom)) { 
        return true; // Return true if the symptom is classified as heavy
    } else {
        return true; // If the symptom is not found in either object, assume it is serious and return true
    }
};

export const getSeriousSymptoms = (symptoms) => {
    console.log(symptoms)
    const serious = []
    for (let i=0; i<symptoms.length; i++){
        if (isSeriousSymptom(symptoms[i])){
            serious.push(symptoms[i])
        }else{
            continue
        }
    }
    return serious
}

export const getCodeFromSymptom = (symptom) => {
    console.log(symptomCodes)

    for (let code in symptomCodes) {
       
        if (symptomCodes[code] == symptom){
            return code
        }
    }
}

export const getCodesFromSymptomsArray = (symptoms) => {
    const temp = []
    for (let i=0; i<symptoms.length; i++){
        const symptom = symptoms[i]
        console.log("SYMPTOM:", symptom)
        const code = getCodeFromSymptom(symptom)
        console.log(code)
        temp.push(code)
    }
    return temp
}


export const sendMessage = async (date, time, contact, statusCode) => {
    const url = '/api/sms'
    const data = {date, time, contact, statusCode}
    try {
        const response = await fetch(url, {
            method: 'POST', // Specify the PUT method
            headers: {
                'Content-Type': 'application/json' // Specify content type for JSON data
            },
            body: JSON.stringify(data) // Convert data object to a JSON string
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // Parse the JSON response
        console.log(result)
    } catch (error) {
        console.error('Error:', error);
    }
}