async function captureMessage(event) {
    event.preventDefault();

    const name = document.getElementById('msgName').value.trim();
    const phone = document.getElementById('msgPhone').value.trim();
    const email = document.getElementById('msgEmail').value.trim();
    const subject = document.getElementById('msgSubject').value.trim();
    const message = document.getElementById('msgBody').value.trim();

    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

    const newMessageProfile = {
        id: Math.floor(100000 + Math.random() * 900000).toString(), 
        name: name,
        phone: phone,
        email: email,
        subject: subject,
        message: message,
        date: formattedDate
    };

    try {
        const response = await fetch(MSG_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMessageProfile)
        });

        if (response.ok) {
            alert("Thank you! Your message has been sent successfully to the admin dashboard.");
            document.getElementById('messageForm').reset();
        } else {
            alert("The database rejected the form log entry.");
        }
    } catch (error) {
        console.error(error);
        alert("Could not connect to the database. Ensure json-server is running on port 3000!");
    }
}