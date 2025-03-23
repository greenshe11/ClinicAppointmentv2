export function getDaysUntilAppointment(month, year, day) {
    // Get today's date
    const today = new Date();
    
    // Set the appointment date
    const appointmentDate = new Date(year, month - 1, day);
    
    // Calculate the difference in milliseconds
    const timeDifference = appointmentDate - today;
    
    // Convert milliseconds to days (1 day = 1000ms * 60s * 60m * 24h)
    const daysUntilAppointment = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysUntilAppointment;
}