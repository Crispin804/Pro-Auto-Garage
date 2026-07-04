const API_URL = "http://localhost:3000/booking";

async function syncDashboard() {
    try {
        const response = await fetch(API_URL);
        const bookings = await response.json();
        
        const today = new Date();
        const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
        
        const totalCount = bookings.length;
        const todayCount = bookings.filter(b => b.date === todayStr).length;
        const inServiceCount = bookings.filter(b => b.status === "In Service").length;
        
        const dynamicRevenue = bookings
            .filter(b => b.status === "Completed")
            .reduce((sum, b) => sum + parseFloat(b.cost || 0), 0);

        document.getElementById('total-bookings').textContent = totalCount;
        document.getElementById('today-bookings').textContent = todayCount;
        document.getElementById('in-service-bookings').textContent = inServiceCount;
        document.getElementById('total-revenue').textContent = `Ksh ${dynamicRevenue.toLocaleString()}`;

        renderTableRows(bookings);
    } catch (error) {
        console.error("Critical error while synchronizing engine with db.json stream:", error);
    }
}

function renderTableRows(dataArray) {
    const container = document.getElementById('table-rows');
    if (!container) return;
    
    container.innerHTML = ''; 
    
    [...dataArray].reverse().forEach(b => {
        let statusClasses = "bg-orange-50 text-orange-600";
        if (b.status === "In Service") statusClasses = "bg-blue-50 text-blue-600";
        if (b.status === "Completed") statusClasses = "bg-emerald-50 text-emerald-600";
        if (b.status === "Cancelled") statusClasses = "bg-red-50 text-red-600";

        let actionButtonHtml = "";

        if (b.status === "Pending") {
            actionButtonHtml = `
                <div class="flex items-center justify-end space-x-2">
                    <button onclick="updateStatus('${b.id}', 'In Service')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-sm transition">
                        <i class="fa-solid fa-gears mr-1"></i> Start Service
                    </button>
                    <button onclick="cancelBooking('${b.id}')" class="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-sm transition">
                        <i class="fa-solid fa-trash mr-1"></i> Cancel
                    </button>
                </div>`;
        } else if (b.status === "In Service") {
            actionButtonHtml = `
                <div class="flex items-center justify-end space-x-2">
                    <button onclick="updateStatus('${b.id}', 'Completed')" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-sm transition">
                        <i class="fa-solid fa-circle-check mr-1"></i> Close & Pay
                    </button>
                    <button onclick="cancelBooking('${b.id}')" class="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-sm transition">
                        <i class="fa-solid fa-trash mr-1"></i> Cancel
                    </button>
                </div>`;
        } else if (b.status === "Cancelled") {
            actionButtonHtml = `<span class="text-red-400 font-bold italic text-[11px]"><i class="fa-solid fa-ban mr-1"></i> Cancelled Logs</span>`;
        } else {
            actionButtonHtml = `<span class="text-slate-400 font-bold italic text-[11px]"><i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> Archived</span>`;
        }

        container.innerHTML += `
            <tr class="hover:bg-slate-50/70 transition table-row-item">
                <td class="p-4 font-bold text-[#0B132B] name-cell">
                    <div class="flex flex-col">
                        <span>${b.customer}</span>
                        <span class="text-[10px] text-slate-400 font-mono font-normal tracking-wide">Ref: #${b.id}</span>
                    </div>
                </td>
                <td class="p-4 text-slate-600 font-semibold car-cell">${b.car}</td>
                <td class="p-4 text-slate-600 font-medium">
                    <span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/50">${b.serviceType}</span>
                </td>
                <td class="p-4 font-bold text-slate-900">Ksh ${parseFloat(b.cost || 0).toLocaleString()}</td>
                <td class="p-4 text-center">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wide inline-block ${statusClasses}">
                        ${b.status}
                    </span>
                </td>
                <td class="p-4 text-right">${actionButtonHtml}</td>
            </tr>
        `;
    });
}

async function updateStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            syncDashboard();
        }
    } catch (error) {
        console.error("Failed to execute PATCH operations update loop:", error);
    }
}

async function cancelBooking(id) {
    if (!confirm("Are you sure you want to cancel this vehicle service request? This operation will remove the sheet record completely from db.json.")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            syncDashboard();
        }
    } catch (error) {
        console.error("Destructive cancel query dropped across transmission pipeline:", error);
    }
}

function filterTableLog() {
    const query = document.getElementById('tableSearch').value.toLowerCase().trim();
    const rows = document.querySelectorAll('.table-row-item');
    
    rows.forEach(row => {
        const name = row.querySelector('.name-cell').textContent.toLowerCase();
        const car = row.querySelector('.car-cell').textContent.toLowerCase();
        
        if (name.includes(query) || car.includes(query)) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}

window.onload = syncDashboard;