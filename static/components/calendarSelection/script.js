// Component
import { Component } from "/static/components/script.js";
import { sendMessage } from "/static/pageScripts/utils.js"


/**
 * @description fetches appointments from database based on any filter
 * @param {Object} filter 
 * @returns 
 */
export async function createAppointment(id, day, month, time, year, minutes, diagnosisCode, complaints){
    const data = {
        Patient_ID: id, 
        Smsnotif_ID: 0,
        Appointment_Day: day,
        Appointment_Month: month,
        Appointment_Time: time,
        Appointment_Year: year,
        Appointment_Minutes: minutes,
        Appointment_Confirmed: 0,
        Symptoms_ID: 0,
        Appointment_DiagnosisCode: diagnosisCode,
        Appointment_Complaints: complaints,
    }
    console.log("NEW DATA", data)
   
    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

    const resJson = await response.json()
    console.log("createAppointment() ", resJson)
    return resJson
}

export function getAppointmentsFilter(filter) {
    const keys = Object.keys(filter) // gets keys of filter object
    let parameters = '?' // initialization

    // create parameter strings based on filter
    for (let i=0; i<keys.length; i++){
        let temp = `${keys[i]}=${filter[keys[i]]}`
        parameters = parameters + temp
        if (i<keys.length-1){ // add '&' if next loop is not the end of iteration
            parameters = parameters + '&'
        }
    }

    return fetch(`/api/appointments/forPatient${parameters}`) // fetching via api GET
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            return [];
        });
}

/**
 * @description gets appointments using month, year, and day as filter
 * @param {Integer} month 
 * @param {Integer} year 
 * @param {Integer} day 
 * @returns 
 */
export async function getAppointments(month, year, day) {
    return fetch(`/api/appointments/forPatient?Appointment_Month=${month}&Appointment_Day=${day}&Appointment_Year=${year}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            return [];
        });
}


/************ */
/************ */
// Initialize calendar related global variables
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = null
let selectMonth = null

export let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let monthAndYear = null

/**
 * @description onclick function to get into next month in calendar
 */
function next() {
    timeChooser([]) // resets time 
    selected.time = null
    selected.minutes = null
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear; // go to next year is current month is december
    currentMonth = (currentMonth + 1) % 12; // make current month to january when current month is december
    preShowCalendar(currentMonth, currentYear); // re renders calendar
}

/**
 * @description onclick function to get into previous month in calendar
 */
function previous() {
    timeChooser([])
    selected.time = null
    selected.minutes = null
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    preShowCalendar(currentMonth, currentYear);
}

/**
 * @description changes classes of elements with current class
 * @param {String} newClass 
 * @param {String} oldClass 
 */
function resetClassName(newClass, oldClass) {
    const elements = document.getElementsByClassName(oldClass);
    const elementsArray = Array.from(elements);
    elementsArray.forEach(element => {
        element.className = newClass;
    });
}

/**
 * @description gets available time for the current day
 * @param {Object} data data for the appointments for that day
 * @returns 
 */
function getAvailableTime(data){
    let hoursAll = [8,9,10,11,1,2,3,4];
    let minsAll = [0, 30]
    let timeAll = []
    for (let index in hoursAll){
        for (let index2 in minsAll){
            timeAll.push([hoursAll[index], minsAll[index2]])
        }
    }
    for (let i=0; i<data.length; i++){
        // hours
        const valueToRemove = data[i].Appointment_Time;
        const minuteToRemove = data[i].Appointment_Minutes;
        console.log("data",valueToRemove, minuteToRemove)
        timeAll = timeAll.filter(t => !(t[0] == valueToRemove && t[1] == minuteToRemove));
        // minutes
        
        /*if (index !== -1) {
            hoursAll.splice(index, 1);
        }*/
    }

    console.log("ALL TIME",timeAll)
    return timeAll
}

/**
 * @description gets appointment data and uses result as argument to the callback function. Used for getting available time with the data fetched.
 * @param {INteger} month 
 * @param {Integer} year 
 * @param {Integer} day 
 * @param {Function} callback 
 */
function fetchAppointments(month, year, day, callback){
    getAppointments(month, year, day).then(times => {
        
        callback(times);
    });
}

/**
 * @description sets ui to contain hours available for appointment
 */
function timeChooser(time) {

    const dropDowns = document.getElementsByClassName("dr-hoursChoices");
    const dropDown = dropDowns[0];
    dropDown.innerHTML = '';
    let initial = '';
    if (time.length  <= 0){
        selected.time = null
        selected.minutes = null
        return
    }
    
    if (dropDowns.length > 0) {
        
        const createChoice = (time) => {
            let value = time[0];
            let min = time[1]
            if (value >= 8) {
                return `<option value="${value}:${min||"00"}">${value}:${min||"00"} AM</option>`;
            } else {
                return `<option value="${value}:${min||"00"}">${value}:${min||"00"} PM</option>`;
            }
        };
        for (let i = 0; i < time.length; i++) {
            initial += createChoice(time[i]);
        }
        dropDown.innerHTML = initial;
    try{
        const valuee = document.getElementById('dr-month1').childNodes[0].value
        console.log(valuee, "VALUEEEE")
        selected.time = valuee.split(":")[0]
        selected.minutes = valuee.split(":")[1]
    }catch(e){

    }
   
    } else {
        console.error('No elements found with the class name "dr-hoursChoices".');
    }
}

/**
 * @description onclick event when a day is selected in calendar.
 * @param {OnclickEvent} event 
 * @returns 
 */
function sendFullDate(event){
    resetClassName('dr-date-picker', 'dr-date-picker dr-date-active');
    const element = event.target.closest('td.dr-date-picker');
    const month = element.getAttribute('data-month');
    const day = element.getAttribute('data-day');
    const year = element.getAttribute('data-year');
    
    let preReturn = false;
    if (month == null || month == 'null'){
        preReturn = true;
    }
    if (element.className != "dr-date-picker"){
        preReturn = true;
    }
    if (preReturn) {return timeChooser([])}
    element.className = element == `${element.className} dr-date-active`? element.className : `${element.className} dr-date-active`;
    fetchAppointments(month, year, day, (data) => {
        timeChooser(getAvailableTime(data))}); // gets appointments for that selected day and makes hours available visibile to ui
    
    console.log(month, day, year);
    
    // global variables
    selected.month = month
    selected.day = day
    selected.year = year
}

function isDateLessThanCurrent(year, month, day) {
    const currentDate = new Date();
    const givenDate = new Date(year, month - 1, day);
    return givenDate < currentDate;
}

function preShowCalendar(month, year){
    fetchAppointments(month+1, year, "null", (data)=>{showCalendar(month, year, data)});
}

/***
 * copied from web
 */
function showCalendar(month, year, monthData) {
    let firstDay = new Date(year, month, 1).getDay();
    let tbl = document.getElementById("dr-calendar-body");
    tbl.innerHTML = "";

    let newRow = document.createElement('tr')
    for (let i = 0; i < days.length; i++) {
        const newCell = document.createElement('td');
        newCell.textContent = `${days[i]}`;
        newCell.classList.add('dr-day-header')
        newRow.appendChild(newCell); // Append the td to the tr
    }
    tbl.appendChild(newRow)
    
    monthAndYear.innerHTML = months[month] + " " + year;

    const getFilledCount = (day, year) =>{
        let count = 0;
        for (let i=0; i<monthData.length; i++){
            if (monthData[i].Appointment_Day == day && monthData[i].Appointment_Year == year){
                count = count + 1;
            }
        }
        return count;
    }

    const evaluateCount = (cell=null) =>{
        if (getFilledCount(date, year)>=8){
            cell.className = `${cell.className} dr-filled`;
            return true;
        }
        return false;
    }

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                let cell = document.createElement("td");
                cell.className = "dr-date-picker";
                cell.innerHTML = "<a>" + date + "</a>";

                cell.onclick = (event) => {
                    sendFullDate(event)}

                if (j==6 || j==0 || evaluateCount(cell)){
                    cell.setAttribute("data-day", null);
                    cell.setAttribute("data-month", null);
                    cell.setAttribute("data-year", null);
                    cell.setAttribute("data-month_name", months[month]);
                }
                else if(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.setAttribute("data-day", null);
                    cell.setAttribute("data-month", null);
                    cell.setAttribute("data-year", null);
                    cell.setAttribute("data-month_name", months[month]);
                    cell.className = `${cell.className} dr-today`;
                } else {
                    cell.setAttribute("data-day", date);
                    cell.setAttribute("data-month", month + 1);
                    cell.setAttribute("data-year", year);
                    cell.setAttribute("data-month_name", months[month]);
                }
                if (isDateLessThanCurrent(year, month+1, date)){
                    cell.className = `${cell.className} dr-done`;
                }
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}
//*

/**
 * MODAL Calendar
 */
// GLOBALS
export let selected = {month: null, date: null, year: null, time:null, monthName:null, timeName:null, 
    appointmentId:null, contact:null, minutes:null} // used for rescheduling only
export let btn = null
let dialogChat = null
let purposeClass = null
//

export const setCalendarButtonOpeners = (element) => {
    btn = element
}
/**
 * @description shows calendar
 */
export function onClickShowCal(month=null,year=null){
    const calendar = document.getElementById('calendar')
    calendar.classList.add('active');
    
    const dimmer = document.getElementById('dr-dimmer')
    calendar.style.display = "block"
    dimmer.style.display = "block"

    document.addEventListener('click', outsideClickListener);
    let month0 = currentMonth
    let year0 = currentYear
    if (month){
        month0 = month
    }
    if (year){
        year0 = year
    }
    if (month||year){
        preShowCalendar(month0,year0)
    }
}

/**
 * @description Closes when pressed x button
 */
function onClickCloseCal(){
    
    const calendar = document.getElementById('calendar')
    const dimmer = document.getElementById('dr-dimmer')
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
    const calendar = document.getElementById('calendar');
    const modalContent = document.querySelector('.dr-body');
    //const btn = document.getElementById('dr-modal-btn')
   
    // Close the modal if click is outside the modal content
    if (calendar.style.display === "block" && !calendar.contains(event.target)) {
        let proceed = true
        console.log(btn.length)
        console.log(btn)
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
function onChangeTime(event){
    console.log("Changed to value:",event.target.value)
    console.log(event)
    const value = event.target.value
    selected.time = value.split(":")[0]
    selected.minutes = value.split(":")[1]
    console.log('SET TIME TO:', selected.time, selected.minutes)
}

/**
 * @description calculate the day between selected date and todays date
 * @returns 
 */
export function getDaysUntilAppointment() {
    // Get today's date
    const selectedDate = selected
    const today = new Date();
    
    // Set the appointment date
    const appointmentDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
    
    // Calculate the difference in milliseconds
    const timeDifference = appointmentDate - today;
    
    // Convert milliseconds to days (1 day = 1000ms * 60s * 60m * 24h)
    const daysUntilAppointment = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysUntilAppointment;
}

/**
 * @description store session; 
 */
export async function storeAppointmentSession() {
    console.log("SESSION", selected)
    const res = await fetch(`/api/session/storeAppointmentDate?month=${selected.month}&day=${selected.day}&year=${selected.year}&minutes=${selected.minutes}&time=${selected.time}&timeName=${selected.timeName}&monthName=${selected.monthName}`)
    const resJson = await res.json()
    console.log(resJson)
    
}

/**
 * @description gets session saved for appointment
 * @returns 
 */
export async function getAppointmentSession() {
    const res = await fetch(`/api/session/getAppointmentDate`)

    const resJson = await res.json()
    console.log(resJson)
    return resJson
}

/**
 * @description gets stored session for client
 * @returns Object
 */
export async function getSession(){
    const res = await fetch(`/api/session`)

    const resJson = await res.json()
    console.log(resJson)
    return resJson
}

/**
 * @description gets time name with AM or PM. 8 am to 5pm
 * @param {*} time 
 * @returns 
 */
export const getTimeName = (time) =>{
    console.log("TIME NAME", time)
    const createChoice = (time) => {
        let value = time[0];
        let min = time[1]
        if (value >= 8) {
            return `${value}:${min=="0"?"00":min} AM`;
        } else {
            return `${value}:${min=="0"?"00":min} PM`;
        }
    };
    return createChoice(time)
}

/**
 * @description Function when clicking main button
 */
function onSetFunction(){
    // get date
    // get time
    // get Month Name
    // sets if PM or AM
    
    // selected comes from global variable object {}
    let month = selected.month
    let day = selected.day
    let year = selected.year
    let time = selected.time
    let minutes = selected.minutes
    let monthName = months[month-1]
    let timeName = getTimeName([time, minutes])
    selected.monthName = monthName
    selected.timeName = timeName
    purposeClass.onSetAdditionalFunction()

}

export async function deleteAppointment(appointmentId){
const response = await fetch('/api/appointments', {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Appointment_ID: appointmentId}),
        });

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result.hasOwnProperty('customError'))
        if (result.hasOwnProperty('customError')) {
             alert(result.customError)
             return
        }
        alert("Appointment Deleted!")
        

}

export async function rescheduleAppointment(appointment_id, month, day, year, time, minutes){
    const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Appointment_ID: appointment_id, 
            Appointment_Month: month,
            Appointment_Day: day,
            Appointment_Year: year,
            Appointment_Minutes: minutes,
            Appointment_Time: time,
            Appointment_Confirmed: 0}),
        });

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result.hasOwnProperty('customError'))
        if (result.hasOwnProperty('customError')) {
             alert(result.customError)
             return
        }
        alert("Reschedule Successful.")
        location.reload() //reloading page
}


/**
 * PURPOSE SPECIFIC, ex. for patient set appointment/ rescheduling
 */

class Purpose{ // blueprint/class
    constructor(){

    }
    // Script to run initially, differs based on purpose
    initialRun(){
        
    }
    // This will run after clicking the main button (onSetFunction); differes based on purpose
    onSetAdditionalFunction(){

    }
}

const schedulesPatient = new Purpose() // for rescheduling
schedulesPatient.initialRun = () => { // no init scripts

}
// same as cbp appointment but will not store session and dont display and additional message
schedulesPatient.onSetAdditionalFunction = () => {

    const month = selected.month
    const day = selected.day
    const year = selected.year
    const time = selected.time
    const minutes = selected.minutes
    const monthName = selected.monthName
    const timeName = selected.timeName
    const contact = selected.contact

    if (!(time)){
        alert("Error: You need to set the time and date to make an appointment!")
    } else{
        onClickCloseCal()
        rescheduleAppointment(selected.appointmentId, month, day, year, time, minutes)
        sendMessage(`${monthName} ${day}, ${year}`, timeName, contact, 3)
        return selected
    }
}

const cbpAppointment = new Purpose() // for first appointments
/**
 * @description recovers previous session and only recover session if previous date selected is on future
 */
cbpAppointment.initialRun = () => {
    const recoverSession = async () => {
        const session = await getAppointmentSession()
        console.log(session)
        const keys = Object.keys(session)
        console.log('keys',keys)
        let key = null
        for (key in keys){
            console.log(key)
            selected[keys[key]] = session[keys[key]]
        }

        console.log(selected)
        const allowance = getDaysUntilAppointment()
        console.log(allowance)
        const value = await getAppointments(session.month, session.year, session.day)
        for (let i=0; i<value.length; i++){
            if (value[i].Appointment_Time == session.time && value[i].Appointment_Minutes == session.minutes){
                return null
            }
        }
       
        if (allowance > 0){onSetFunction()} 
    }
}
/**
 * @description this function is run after date is set.
 * @returns 
 */
cbpAppointment.onSetAdditionalFunction = () => {
    const month = selected.month
    const day = selected.day
    const year = selected.year
    const time = selected.time
    const monthName = selected.monthName
    const timeName = selected.timeName
    if (!(time)){
        alert("Error: You need to set BOTH the TIME and DATE to make an appointment!")
    } else{
        onClickCloseCal()
        const daysLeft = getDaysUntilAppointment()
        
        const msg = `Would you like to schedule an appointment on <b>${monthName} ${day}, ${year}</b> at <b>${timeName}</b> ? <i style="color: gray">(${daysLeft} day/s from now)</i>`
        dialogChat.innerHTML = msg
        storeAppointmentSession()

        return selected
    }
}

//*



// create component
const _calendarSelectionObj = new Component('/static/components/calendarSelection/layout.html', '/static/components/calendarSelection/styling.css')
//*

/**
 * 
 * @param {HTMLElement} element element by which the calendar wil be inserted
 * @param {HTMLElement[]} elementButtons buttons elements that is used for opening calendar (for closing purposes) 
 * @param {String} warningName warning message at footer
 * @param {String} buttonName button name for onSet
 * @param {String} purpose purpose of calendar selection, purposes are predefined and functions to be used vary based on this key   
 *  @param {HTMLElement} elementDialog // only for cbp-appointment purpose: null if not needed // element where message
 */
export async function CalendarSelection(element, elementButtons, warningName=null, buttonName=null, purpose='cbp-appointment', elementDialog=null){
   
    // wait for element to be added to document
    await _calendarSelectionObj.setToElement(element)
    document.getElementById('dr-footer-msg').innerHTML = warningName
    document.getElementById('modal-top-name').innerHTML = "Select Time and Date"
    document.getElementById('dr-confirm-button').innerHTML = buttonName
    
    selectYear = document.getElementById("dr-year");
    selectMonth = document.getElementById("dr-month");
    monthAndYear = document.getElementById("dr-monthAndYear");
    
    // set global variables
    btn = elementButtons // btn for opening the modal
    dialogChat = elementDialog // a custom dialog
    //*

    // initial runs and `on set` varies by purpose
    // cbp means for chatbot appointment
    const classObjs = {
        'cbp-appointment': cbpAppointment,
        'sched-patient': schedulesPatient
    }

    purposeClass = classObjs[purpose]
    purposeClass.initialRun() 

    preShowCalendar(currentMonth, currentYear); // show Calendar outisde
    

    // allow functions to be accessed to document html
    window.onClickCloseCal = onClickCloseCal
    window.onSetFunction = onSetFunction
    window.outsideClickListener = outsideClickListener
    window.onClickShowCal = onClickShowCal
    window.showCalendar = showCalendar
    window.next = next
    window.previous = previous
    window.onChangeTime = onChangeTime
    
  }
  window.CalendarSelection = CalendarSelection