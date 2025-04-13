import { mildSymptomsKeysInitial } from "/static/pageScripts/utils.js";
import { heavySymptomsKeysInitial, mildSymptomsLevels, heavySymptomsLevels } from "/static/pageScripts/utils.js";

function smithWaterman(s1,s2){
  // cloned from github
  const match = 2;
  const mismatch = -1;
  const gap = -1;

  const rows = s1.length + 1;
  const cols = s2.length + 1;
  let distance = 0
  let values = []
  let firstScore = true
  
  function calculate_score(matrix, x, y) {
      /* Calculates score for given coordinate in matrix. */

      // compute similarity score
      let similarity = (s1[x-1] == s2[y-1]) ? match : mismatch;
     
      // compute diagonal, above, and left scores
      let score_diag = matrix[x-1][y-1] + similarity;
      let score_above = matrix[x-1][y] + gap;
      let score_left = matrix[x][y-1] + gap;

      const array = [score_diag, score_above, score_left]
      const max= Math.max(score_diag, score_above, score_left);
      
      const i = array.indexOf(max)
      values.push(i)
      if (i==0){
        if (similarity==2){
          if (firstScore){
            distance +=0.5
          }
          distance+=1
        }
        if (similarity==-1){
  
          distance-=1
        }
      }
      firstScore = false
      
      return max
      
  }

  function create_matrix(rows, cols) {
      /* Create scoring matrix */

      // initialize matrix with 0s
      let score_matrix = [];
      for (let i = 0; i < rows; i++) {
          score_matrix[i] = [];
          for (let j = 0; j < cols; j++) {
              score_matrix[i].push(0);
          }
      }

      // compute scores and fill matrix
      let max_score = 0;
      let max_coords = [0,0];
      for (let i = 1; i < rows; i++) {
        
          for (let j = 1; j < cols; j++) {
            
              let score = calculate_score(score_matrix, i, j);
              if (score > max_score) {
                  max_score = score;
                  max_coords = [i,j];
              }
              score_matrix[i][j] = score;
          }
      }
      
      return [score_matrix, max_coords];
  }

  function next_move(score_matrix, x, y) {
      /* Determine next move during traceback */

      let diag = score_matrix[x - 1][y - 1];
      let up   = score_matrix[x - 1][y];
      let left = score_matrix[x][y - 1];

      if ((diag >= up) && (diag >= left)) {
          if (diag != 0) return 1;
          else return 0;
      } else if ((up > diag) && (up >= left)) {
          if (up != 0) return 2;
          else return 0;
      } else if ((left > diag) && (left > up)) {
          if (left != 0) return 3;
          else return 0;
      } else {
          return 0;
      }

  }
  

  function traceback(score_matrix, start_coord) {
      let end = 0;
      let diag = 1;
      let up = 2;
      let left = 3;
      let s1_aligned = [];
      let s2_aligned = [];
      let x = start_coord[0];
      let y = start_coord[1];
      let move = next_move(score_matrix, x, y);

      while (move != end) {
          if (move == diag) {
              s1_aligned.push(s1[x-1]);
              s2_aligned.push(s2[y-1]);
              x--;
              y--;
          } else if (move == up) {
              s1_aligned.push(s1[x-1]);
              s2_aligned.push('-');
              x--;
          } else {
              s1_aligned.push('-');
              s2_aligned.push(s2[y-1]);
              y--;
          }
          move = next_move(score_matrix, x, y);
      }

      s1_aligned.push(s1[x-1]);
      s2_aligned.push(s2[y-1]);

      return [s1_aligned.reverse(), s2_aligned.reverse()];
  }

  let m = create_matrix(rows,cols)
  let res= rows-distance
  return res
}

export let levelQuestions = {}

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
        console.log(symptomNameTrimmed)
        const fetchedSymptomNameData = await (await fetch(`/api/symptomsref?SymptomsRef_Name=${symptomNameTrimmed}`)).json()
        console.log("FETCHS", fetchedSymptomNameData)
        const levels = []
        for (let index in fetchedSymptomNameData){
            const targetSymptomNameData = fetchedSymptomNameData[index]
            levels.push(targetSymptomNameData["SymptomsRef_Level"])
        }
        return levels

    }
}

class WordSuggestions{
  constructor(wordBag){
    this.wordBag = wordBag
    this.evaluateInput('')
    this.symptoms = [] // deprecated
    this.symptoms0 = {} // new
    this.clearForNext = {'selection-0': true, 'selection-1': true, 'selection-2': true, }
  }

  editDistance(a, b){
    function customCheck(a, b) {
      return a === b;
  }
    const updateCost = 1 // changing
    const insertCost = 0 // missing
    const deletionCost =1 // removing / excess

    var t = [], u, i, j, m = a.length, n = b.length;
    if (!m) { return n; }
    if (!n) { return m; }
    for (j = 0; j <= n; j++) { t[j] = j; }
    for (i = 1; i <= m; i++) {
        for (u = [i], j = 1; j <= n; j++) {
            u[j] = customCheck(a[i - 1], b[j - 1]) ? t[j - 1] : Math.min(t[j - 1] + updateCost, t[j] + deletionCost, u[j - 1] + insertCost); 
        } t = u;
    } return u[n];
}
    getOverallDistancel(word, wordBasis, func){
      let wordArray = wordBasis.split(' ')
      wordArray.push(wordBasis)
      let leastNum = null
      for (let i=0; i<wordArray.length; i++){
        const key = wordArray[i].toLowerCase()
        
        let distance = func(word, key)
        if (leastNum==null){
          leastNum = distance
        }
        if (distance<leastNum){
          leastNum = distance
        }
      }
      return leastNum
    }
    
    getNearestWord(word,  data=null){
      if(!data){
        data = this.wordBag
      }

      const func = smithWaterman
      const distances = {}
      for (let i=0; i<data.length; i++){
        const key = data[i]
        distances[key] = this.getOverallDistancel(word, key, func)//this.getOverallDistancel(word, key)
        
      }
      const sortedEntries = Object.entries(distances).sort(([, valueA], [, valueB]) => valueA - valueB);
      
      const getOutput = (key, value, returnValue)=> {
        if(returnValue){
          return value
        }else{
          return key
        }
        
      }

      let res = sortedEntries.slice(0, sortedEntries.length)
      let finalList = []
      let resValues = res.map(([key,value]) => getOutput(key,value,true))
      let resNames = res.map(([key,value]) => getOutput(key,value, false)) // Extract the keys
     
      const topValue = resValues[0]
      let benchmark = topValue*1.6
      if (topValue<0){
        benchmark = topValue/1.6
      }

      for (let i=0;i<resValues.length;i++){
        
        if ((resValues[i]<=benchmark || resValues[i]<5)){
          finalList.push(resNames[i])
        }
      }

      return finalList
      
      
    }

  evaluateInput(){ // handler when textbox is being typed
    const word = document.getElementById("textbox").value.toLowerCase();
   
    const symptomsSuggested = this.getNearestWord(word)
    symptomsSuggested.unshift('... others')
    const suggestionList = document.getElementById('symptoms-suggestion-list');
    
    // Populate the suggestion list
    suggestionList.innerHTML = ''
    symptomsSuggested.forEach((symptom, index) => {
        const li = document.createElement('li');
        li.textContent = symptom;
        li.classList.add('dropdown-item')
        li.classList.add('symptom')
        if (symptom == '... others'){
          li.style.color = 'red'
        }

        li.onclick = ()=>{this.addToSelectedSymptoms(li)}
        //this.addToSelectedSymptoms(li)
        suggestionList.appendChild(li);
    });
  }
  removeSymptomTag(parent, element){
    parent.removeChild(element)
    this.updateTags(parent)
    for (let key in this.symptoms0){
      
      if (this.symptoms0[key] == element.innerHTML){
        delete this.symptoms0[key]
      }
    }
    this.updateRadio()
  }

  setClear(index, name, id){
    console.log("CLEARING")
    this.clearForNext[`selection-${index}`] = true
    this.symptoms[index] = this.symptoms[index]// + name
    this.symptoms0[id] = name
    console.log("CLEAR FO RNEXT", this.symptoms, this.symptoms0)
  }

  async updateRadio(){
    const tagsElement = document.getElementById('symptom-tags-list') // element where to put tags
    levelQuestions = {}
    
    document.getElementById('selection-0').innerHTML = ''
    document.getElementById('selection-2').innerHTML = ''
    document.getElementById('selection-1').innerHTML = ''
    this.clearForNext['selection-0'] = true
    this.clearForNext['selection-1'] = true
    this.clearForNext['selection-2'] = true
    const symptomNames = []
    tagsElement.childNodes.forEach((element)=>{
      
      symptomNames.push(element.innerHTML)
    })
    //const data = await (await fetch("api/symptomsref")).json()
    for (let index in symptomNames){
      if (symptomNames[index] == "... others"){
        setClear(index, "... others", "00")
        continue
      }
      console.log(symptomNames, "symptomNames")
      const targetRadio = document.getElementById(`selection-${index}`)
      targetRadio.innerHTML = ''
     
      //console.log(data, "HAI")
      let question = `<p>How would you describe your <b>${symptomNames[index]}</b>?</p>`
      let content = ""
      //console.log("yp",await symptomsRef.getSymptomNameLevels(symptomNames[index]))
      const symptomMildData = await ((await fetch(`/api/symptomsref?SymptomsRef_Name=${symptomNames[index]}&SymptomsRef_IsMild=1`)).json()) // mildSymptomsLevels[symptomNames[index]]
      const symptomSevereData = await ((await fetch(`/api/symptomsref?SymptomsRef_Name=${symptomNames[index]}&SymptomsRef_IsMild=0`)).json()) // mildSymptomsLevels[symptomNames[index]]
      console.log(symptomMildData, symptomSevereData)
      let levels = symptomMildData.map((value)=>value["SymptomsRef_Level"]) // mildSymptomsLevels[symptomNames[index]]
      let ids = symptomMildData.map((value)=>value["SymptomsRef_ID"])
      let names = symptomMildData.map((value)=>value["SymptomsRef_Name"])
      console.log(levels)
      console.log("LEVELS")
      if(!levels){
        continue
      }
     
      //console.log('heav', heavySymptoms)
      //console.log(heavySymptomsLevels[symptomNames[index]])
      levels = levels.concat(symptomSevereData.map((value)=>value["SymptomsRef_Level"]))
      ids = ids.concat(symptomSevereData.map((value)=>value["SymptomsRef_ID"]))
      names = names.concat(symptomSevereData.map((value)=>value["SymptomsRef_Name"]))
    
      console.log("FINALEVELS", levels)
      for (let levelIndex in levels){
        if (!levels[levelIndex]){continue}
        content = content + `<button name="${index}" style="text-align: left;white-space: pre-line" onclick="setClear(${index}, '${names[levelIndex]}', '${ids[levelIndex]}')" value="${levels[levelIndex]}">${levels[levelIndex]}</button>`
      }
      console.log('levels', levels.length>0)
      console.log(levels?true:false)
      if (levels.length>0 && (levels[0] != '')){
        this.clearForNext[`selection-${index}`] = false
        targetRadio.innerHTML = content + '<hr>'
      }
      console.log("levels", levels)
      //console.log(symptomNames[index])
      if (levels.length<1 || !levels[0]){
        continue
      }
      else{
        levelQuestions[question] = content
        console.log(levelQuestions)
      }
     
    }
  }

  updateTags(element){
    this.symptoms = [] // resets selected symptoms
    element.childNodes.forEach(symptom => { // add symptoms based on name of tag
      console.log(symptom,'sym-s')
      this.symptoms.push(symptom.textContent) 
      //this.symptoms = [...new Set(this.symptoms)];
    });
    console.log(this.symptoms)

    this.updateRadio()
  }

  addToSelectedSymptomsFromSession(stringArray){
    // add tags from startup with session
    return 
    console.log("Syse", stringArray)
    for (let i=0; i<stringArray.length; i++){
      this.addToElement(stringArray[i].split('(')[0 ])
    }
  }

  addToElement(name){ // function crate a tag if a symptom is selected,
    const targetElement = document.getElementById('symptom-tags-list') // element where to put tags
    let tag = document.createElement('div')
    tag.textContent = name
    tag.classList.add('symptom-tag') // styling
    tag.onclick = () => {
      this.removeSymptomTag(targetElement, tag) // remove tag when tag is selected
    }

    // resets data before adding again all selected
    targetElement.append(tag)
    this.symptoms = [] // resets selected symptoms
    this.updateTags(targetElement) // this will refill data by readding all selected symptoms based on tags
    console.log('sym-',this.symptoms)
  }

  addToSelectedSymptoms(element){
    // limit adding of symptoms to 5 and prevent readding of already selected symptoms
    if (this.symptoms.length > 2 || (this.symptoms.includes(element.textContent))){
      return
    }
    console.log('selected', element.textContent)
    this.addToElement(element.textContent)
    
  }
}


/**
 * GLOBALS
 */
let wordSuggestionObj = null
import { Component } from "/static/components/script.js";
import { mildSymptoms, heavySymptoms } from "/static/pageScripts/utils.js";
import { getCodesFromSymptomsArray } from "/static/pageScripts/utils.js";

// API FETCHES ____________________________________
export async function getSymptomsFromDb(Appointment_ID) {
  const res = await fetch(`/api/symptoms?Appointment_ID=${Appointment_ID}`)

  const resJson = await res.json()
  
  return resJson
}

export async function deleteSymptomsFromDb(Appointment_ID){
  try {
    const response = await fetch('/api/symptoms', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({Appointment_ID: Appointment_ID}),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result

  } catch (error) {

}
}
export async function storeResponseSession(array) {
  try {
      const response = await fetch('/api/session/storeSymptomsResponse', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({"response": array}),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
    

  } catch (error) {

  }
}

export async function resetSymptomsSelected() {
  try {
      const response = await fetch('/api/session/storeSymptomsSelected', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({"symptoms": [], "code": []}),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
    

  } catch (error) {

  }
}

export async function storeSymptomsSession() {
  const codesFromSelectedSymptoms = wordSuggestionObj.symptoms0
  console.log("codes", codesFromSelectedSymptoms)
  try {
      const response = await fetch('/api/session/storeSymptomsSelected', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({"symptoms": wordSuggestionObj.symptoms, "code": codesFromSelectedSymptoms}),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
    

  } catch (error) {

  }
}

export async function getSymptomsSession(addToElement=true) {
    const res = await fetch(`/api/session/getSymptomsSelected`)

    const resJson = await res.json()
    console.log("RESTORED SESSION", resJson)
    if (addToElement){
     wordSuggestionObj.addToSelectedSymptomsFromSession(resJson['symptoms_selected'])
    }
    return resJson
}

// ___________________________________________________

/**COMPONENTS */

// create component
const _symptomsSelectionObj = new Component('/static/components/symptomsSelection/layout.html', '/static/components/symptomsSelection/styling.css')
//*


window.showHideList = () =>{ 
  const btn = document.getElementById('show-btn')
  const textbox = document.getElementById('textbox')
  const suggList = document.getElementById('symptoms-suggestion-list')
  const label = btn.innerHTML
  if (label == 'ok') {
    suggList.style.display = 'none'
    btn.innerHTML = 'search'
    textbox.disabled = true
  } else {
    suggList.style.display = 'block'
    btn.innerHTML = 'ok'
    textbox.disabled = false
  }
}


// GLOBALS
let btn = null
let dialogChat = null
//

export async function getUserData(userId){
    const res = await fetch(`/api/patient?Patient_ID=${userId}`)
    return await res.json()
}

/**
 * @description shows calendar
 */
export async function showSymptomsModal(event){
     
    const calendar = document.getElementById('ss-modal')
    calendar.classList.add('active');
    
    const dimmer = document.getElementById('ss-dimmer')
    calendar.style.display = "flex"
    dimmer.style.display = "flex"
    
    document.addEventListener('click', outsideClickListener);



    
}

/**
 * @description Closes when pressed x button
 */
function onClickCloseCal(){
    console.log("CLOSING")
    const calendar = document.getElementById('ss-modal')
    const dimmer = document.getElementById('ss-dimmer')
    calendar.classList.remove('active')
    calendar.classList.add('inactive')

    setTimeout(() => {
        calendar.style.display = "none";
        dimmer.style.display = "none";
        calendar.classList.remove('inactive')
    }, 400); // Wait for animation to finish before hiding
}

/**
 * @description Closes when pressed outside
 * @param {*} event 
 */
function outsideClickListener(event) {
    const calendar = document.getElementById('ss-modal');
    const modalContent = document.querySelector('#ss-body');
    //const btn = document.getElementById('ss-modal-btn')
   
    // Close the modal if click is outside the modal content
    console.log('target',modalContent.contains(event.target))
    console.log()
    
    if (calendar.style.display === "flex" && !modalContent.contains(event.target) && !Array.from(event.target.classList).includes('symptom-tag')) {
        let proceed = true
        for (let i=0; i<btn.length; i++){
            console.log(i)
            console.log(btn[i])
            if (btn[i].contains(event.target)){
                proceed = false
                console.log('true')
            }
            console.log(proceed)
        }
        
        if (proceed){
            onClickCloseCal();
        }
        
    }
}

export async function symptomsSelection(element,elementButtons){
  
  // wait for element to be added to document
  await _symptomsSelectionObj.setToElement(element)
  
  // word bag
  btn = elementButtons
  document.getElementById('ss-close-btn').onclick = onClickCloseCal
  document.getElementById('ss-cancel').onclick = () => {onClickCloseCal()}
  document.getElementById('ss-confirm').onclick = () => {
    window.toResponse();
    onClickCloseCal();
  }
  const data = await (await fetch("/api/symptomsref")).json()
  const uniquesSymptomNames = [...new Set(data.map((value)=>value["SymptomsRef_Name"]))]
  console.log(data, uniquesSymptomNames,'data')
  const ws = new WordSuggestions(
    // Combine the keys of the two objects into one array
    uniquesSymptomNames//[...mildSymptomsKeysInitial(), ...heavySymptomsKeysInitial()]
  )
  // sets to global variables
  wordSuggestionObj = ws

  // allow functions to be accessed to document, bind object to to method
  window.suggestSymptoms = ws.evaluateInput.bind(ws)
  window.addToSelectedSymptoms = ws.addToSelectedSymptoms.bind(ws)
  window.removeSymptomTag = ws.removeSymptomTag.bind(ws)
  window.storeSymptomsSession = storeSymptomsSession
  window.setClear = ws.setClear.bind(ws)
  getSymptomsSession()
  wordSuggestionObj.updateRadio()
  return ws
  
}
window.SymptomsSelection = symptomsSelection  
console.log("GETTING SYMPTOMS COMPONTNE")