async function performSearch() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) return;
    
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
        const results = await response.json();
        
        const tbody = document.getElementById('searchResults');
        const table = document.getElementById('searchTable');
        const noResults = document.getElementById('noResults');
        
        tbody.innerHTML = '';
        table.style.display = 'none';
        noResults.style.display = 'none';
        
        if (results.length === 0) {
            noResults.style.display = 'block';
            noResults.textContent = 'No results found';
        } else {
            const admin = await isAdmin();
            results.forEach(v => {
                const row = tbody.insertRow();
                let actions = '';
                if (admin) {
                    actions = `
                        <td>
                            <button class="btn btn-secondary btn-sm edit-btn" data-id="${v.id}">Edit</button>
                            <button class="btn btn-sm delete-btn" data-id="${v.id}" style="background: #ef4444;">Delete</button>
                        </td>
                    `;
                }
                row.innerHTML = `
                    <td>${v.id}</td>
                    <td>${v.firstname}</td>
                    <td>${v.lastname}</td>
                    <td>${v.email}</td>
                    <td>${v.phone}</td>
                    ${actions}
                `;
            });
            table.style.display = 'table';
        }
    } catch (error) {
        alert('Search failed');
        console.error(error);
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchTable').style.display = 'none';
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('noResults').textContent = 'Enter keyword to search';
}

// Event handlers
document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('clearBtn').addEventListener('click', clearSearch);
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performSearch();
});

// Admin check for edit/delete (session via API or cookie)
async function isAdmin() {
    try {
        const response = await fetch('/api/user/role'); // Assume endpoint or use session check
        const user = await response.json();
        return user.role === 'admin';
    } catch {
        return false;
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn') || e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        if (confirm((e.target.classList.contains('edit-btn') ? 'Edit' : 'Delete') + ' volunteer?')) {
            window.location = `/${e.target.classList.contains('edit-btn') ? 'volunteer/update' : 'volunteer/delete'}/${id}`;
        }
    }
});

