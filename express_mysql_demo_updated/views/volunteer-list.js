let volunteers = [];
let isAdmin = false;

async function loadVolunteers() {
    const tbody = document.getElementById('volunteerTable');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    try {
        const response = await fetch('/volunteer/volunteers');

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        volunteers = await response.json();
        
        tbody.innerHTML = '';
        
        if (volunteers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No volunteers found</td></tr>';
            return;
        }
        
        volunteers.forEach(v => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${v.id}</td>
                <td>${v.firstname}</td>
                <td>${v.lastname}</td>
                <td>${v.email}</td>
                <td>${v.phone}</td>
                <td>${isAdmin ? 
                    `<button class="btn btn-secondary btn-sm edit-btn" data-id="${v.id}">Edit</button>
                    <button class="btn btn-sm delete-btn" data-id="${v.id}" style="background: #ef4444;">Delete</button>` : '-'
                }</td>
            `;
        });
    } catch (err) {
        console.error('Load error:', err);
        tbody.innerHTML = '<tr><td colspan="6" style="color: red;">Error loading volunteers: ' + err.message + '</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
            const user = await userRes.json();
            isAdmin = user.isAdmin;
        }
    } catch (e) {
        console.error('User check error:', e);
    }
    loadVolunteers();
});
document.getElementById('refreshBtn')?.addEventListener('click', async () => {
    // Re-check admin on refresh if needed, but persist
    loadVolunteers();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        if (confirm('Edit volunteer?')) window.location = `/volunteer/update/${id}`;
    } else if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        if (confirm('Delete volunteer?')) window.location = `/volunteer/delete/${id}`;
    }
});
