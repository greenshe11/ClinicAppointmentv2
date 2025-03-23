
function getName() {
    const userNameDiv = document.getElementById('userName');
    userNameDiv.innerHTML = `Admin`;
}

export const getUserData = async () => {
    const content = await fetch('/api/patient?for=session')
    const resJson = await content.json()
    return resJson
}

async function logout() {
    try {
        const response = await fetch('/api/patient?for=logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if (result.hasOwnProperty('customError')) {
            alert(result.customError);
            return;
        }

        window.location.href = '/login';
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/home';
    }
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    blinkButton = false
}

const closeExpansion = () => {
    document.getElementById('main').style.opacity = '1'
    closeNav();
}

const expand = () => {
    openNav();
    document.getElementById('main').style.opacity = '1'
}

import { Component } from "/static/components/script.js";

// create component
let blinkButton = false 
let isGreen = true
export const makeButtonBlink = () => {
    blinkButton = true
}

setInterval(() => {
    const borderBox = document.getElementById('openbtn');
    if (!blinkButton){return}
    if (isGreen) {
        
        borderBox.style.borderColor = 'green';
        
    } else {
        borderBox.style.borderColor = 'black';
    }
    isGreen = !isGreen; // Toggle the color
}, 1000); // Change color every 1 second (1000 milliseconds)
const _sidebarObj = new Component('/static/components/sidebarStaff/layout.html', '/static/components/sidebarStaff/styling.css')

export async function SidebarStaff(element){
    
    // wait for element to be added to document
    await _sidebarObj.setToElement(element)

    getName()

    // allow functions to be accessed to document, bind object to to method
    window.getName = getName
    window.logout = logout
    window.closeNav = closeNav
    window.openNav = openNav
    window.expand = expand    
    window.closeExpansion = closeExpansion
  }
