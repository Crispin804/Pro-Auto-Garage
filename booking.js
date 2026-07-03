const API_URL = "http://localhost:3000/booking";

function generate8DigitId() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function captureBooking(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const serviceType = document.getElementById('serviceType').value;
    const make = document.getElementById('make').value.trim();
    const model = document.getElementById('model').value.trim();
    const licensePlate = document.getElementById('licensePlate').value.trim();

    let calculatedCost = 0;
    if (serviceType === "Emergency Towing") {
        calculatedCost = 2500;
    } else if (serviceType === "Bodyworks & Painting") {
        calculatedCost = 4500;
    } else if (serviceType === "Mechanical Repairs") {
        calculatedCost = 2500;
    } else if (serviceType === "Wheel Alignment") {
        calculatedCost = 3500;
    } else {
        calculatedCost = 0; 
    }

    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

    const newBookingProfile = {
        id: generate8DigitId(),
        customer: fullName,
        car: `${make} ${model} (${licensePlate})`,
        serviceType: serviceType,
        status: "Pending",
        date: formattedDate,
        cost: calculatedCost
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBookingProfile)
        });

        if (response.ok) {
            alert(`Booking successfully recorded! Assigned reference ID: ${newBookingProfile.id}`);
            document.getElementById('userForm').reset();
        } else {
            alert("Database rejected submission log parameters.");
        }
    } catch (error) {
        console.error(error);
        alert("Could not connect to the database server. Ensure json-server is running on port 3000!");
    }
}