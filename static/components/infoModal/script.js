

import { getAppointmentsFilter, months, getTimeName} from "/static/components/calendarSelection/script.js";
import { getSymptomsFromDb } from "/static/components/symptomsSelection/script.js"
import { createRecommendationSent,  createRecommendationSentFromCode, getSymptomsFromCodeArray} from "/static/pageScripts/utils.js";

// GLOBALS
let btn = null
let dialogChat = null

let firstName = ""
let lastName = ""
//

export async function getUserData(userId){
    const res = await fetch(`/api/patient?Patient_ID=${userId}`)
    return await res.json()
}

/**
 * @description shows calendar
 */
export async function showModal(event){

    console.log(event.srcElement)   
    const month = event.srcElement.getAttribute('data-month') 
    const year = event.srcElement.getAttribute('data-year')
    const day = event.srcElement.getAttribute('data-day')
    const userId = event.srcElement.getAttribute('data-userId')
    const time = event.srcElement.getAttribute('data-time')
    const status = event.srcElement.getAttribute('data-status')
    
    const appointmentId = event.srcElement.getAttribute('data-appointmentId')
    const appointmentData = (await getAppointmentsFilter({Appointment_ID: appointmentId}))[0]
    const userInfo = await getUserData(userId)
   
    const symptomData = await getSymptomsFromDb(appointmentId)
    const symptomCodes = []
    console.log(appointmentId,appointmentData)
    //const symptomsData = await fetch(`/api/symptoms?Appointment_ID=${appointmentId}`)

    for (let i=0; i<symptomData.length; i++){
        console.log(i,symptomData[i]["Appointment_ID"], appointmentData["Appointment_ID"])
        if (symptomData[i]["Appointment_ID"]==appointmentData["Appointment_ID"]){
            symptomCodes.push(symptomData[i].Symptoms_Code)
        }
       
    }
    console.log("info", symptomData)
    //const symptomNames = getSymptomsFromCodeArray(symptomCodes)
    //console.log(symptomNames)
    console.log("CODES", symptomCodes)
    //const symptomResponse = createRecommendationSent(symptomNames)
    const symptomResponse = await createRecommendationSentFromCode(symptomCodes)
    console.log(symptomResponse)
    console.log(symptomCodes)
    console.log('symptom_CODES', symptomCodes)
    console.log("USER INFO", userInfo)
    const getStatusDisplay = (statusCode) =>{ 
        const color = ['black','green','red']
        const name = ['Pending','Confirmed','Rejected']
        return `<span style="color: ${color[statusCode]}">${name[statusCode]}</span>`
    }

    //global setting
    firstName =  userInfo[0].PatientName
    lastName = userInfo[0].PatientLastName
    //
    document.getElementById('im-first-name').innerHTML = userInfo[0].PatientName
    document.getElementById('im-last-name').innerHTML = userInfo[0].PatientLastName
    document.getElementById('im-email').innerHTML = userInfo[0].PatientEmail
    document.getElementById('im-contact-no').innerHTML = userInfo[0].PatientContactNo
    document.getElementById('im-sched-date').innerHTML = `${months[month-1]} ${day}, ${year}`
    document.getElementById('im-time').innerHTML = getTimeName(time)
    document.getElementById('im-status').innerHTML = getStatusDisplay(status)
    document.getElementById('im-sched-response').innerHTML = symptomResponse
    document.getElementById('im-category').innerHTML = userInfo[0].PatientCategory
    document.getElementById('im-sched-complaints').innerHTML = appointmentData.Appointment_Complaints||"N/A"
   

    

    
    const calendar = document.getElementById('im-modal')
    calendar.classList.add('active');
    
    const dimmer = document.getElementById('im-dimmer')
    calendar.style.display = "flex"
    dimmer.style.display = "flex"
    
    document.addEventListener('click', outsideClickListener);



    
}

/**
 * @description Closes when pressed x button
 */
function onClickCloseCal(){
    console.log("CLOSING")
    const calendar = document.getElementById('im-modal')
    const dimmer = document.getElementById('im-dimmer')
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
    const calendar = document.getElementById('im-modal');
    const modalContent = document.querySelector('#im-body');
    //const btn = document.getElementById('im-modal-btn')
   
    // Close the modal if click is outside the modal content
    console.log('target',modalContent.contains(event.target))
    if (calendar.style.display === "flex" && !modalContent.contains(event.target)) {
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

/**
 * @description Runs when changing time
 * @param {*} event 
 */

// Component
import { Component } from "/static/components/script.js";
// create component
const _infoModalObj = new Component('/static/components/infoModal/layout.html', '/static/components/infoModal/styling.css')
//*


export async function InfoModal(element, elementButtons){
   
    // wait for element to be added to document
    await _infoModalObj.setToElement(element)
    btn = elementButtons
    document.getElementById('im-close-btn').onclick = onClickCloseCal
  }


window.printInfo = (event) =>{
    function printDiv(divId) {
        const printContents = document.getElementById(divId)
        const originalContents = document.body.innerHTML;
  
        
        printContents.style.backgroundColor = "blue"
        document.body.innerHTML = printContents.innerHTML;;
        window.print();
        
        document.body.innerHTML = originalContents; // Restore the original page
      }
    printDiv("im-scrollview")
}

import {getSession} from '/static/pageScripts/session.js'
//import { createRecommendationSentFromCode } from "../../pageScripts/utils";
async function removeUserFilterForPatients(){
    console.log('filter',document.getElementById("info-filter"))
    const session = await getSession()
    console.log("SESSION", session)
    if (!session["isStaff"]){
        document.getElementById("info-filter").remove()
    }
}
//remove see user records if a patient

setTimeout(()=>{
    removeUserFilterForPatients()
},1000)
window.filterUser = (event) => {
    // element from mainstaff.html
    
    document.getElementById("first-name-filter").value = firstName
    
    document.getElementById("last-name-filter").value = lastName
    document.getElementById("month-filter").value = "0"
    //document.getElementById("year-filter").value = ""
    document.getElementById("status-filter").value = "-1"
    onClickCloseCal()
    window.useFilter()

}