import {
    addVolunteer,
    getVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer,
    searchVolunteers
} from '../models/volunteerModel.js';

// Create volunteer
export function createVolunteer(req, res) {
    console.log('POST /volunteer - req.method:', req.method);
    console.log('POST /volunteer - req.body:', req.body);
    
    const firstname = (req.body?.firstname || '').trim();
    const lastname = (req.body?.lastname || '').trim();
    const email = (req.body?.email || '').trim();
    const phone = (req.body?.phone || '').trim();
    
    console.log('Trimmed - f:', firstname, 'l:', lastname, 'e:', email, 'p:', phone);
    
    if (firstname.length === 0 || lastname.length === 0 || 
        email.length === 0 || phone.length === 0 || 
        !/^[^\@ \t\n\r]+@[^\@ \t\n\r\.]+\.[^\@ \t\n\r]+$/.test(email)) {
        console.log('Validation failed');
        return res.status(400).send(`Missing/invalid fields. f:"${firstname}" l:"${lastname}" e:"${email}" p:"${phone}"`);
    }
    
    addVolunteer({ firstname, lastname, email, phone }, (err) => {
        if (err) {
            console.error('DB insert err:', err);
            return res.status(500).send('DB error: ' + err.message);
        }
        console.log('Volunteer created!');
        res.redirect('/dashboard');
    });
}

// View all volunteers
export function listVolunteers(req, res) {
    console.log('GET /volunteers');
    getVolunteers((err, results) => {
        if (err) {
            console.error('List err:', err);
            return res.status(500).json({error: err.message});
        }
        console.log('Fetched', results.length, 'volunteers');
        res.json(results);
    });
}

// Update
export function editVolunteer(req, res) {
    const firstname = (req.body?.firstname || '').trim();
    const lastname = (req.body?.lastname || '').trim();
    const email = (req.body?.email || '').trim();
    const phone = (req.body?.phone || '').trim();
    
    if (firstname.length === 0 || lastname.length === 0 || email.length === 0 || phone.length === 0 ||
        !/^[^\@ \t\n\r]+@[^\@ \t\n\r\.]+\.[^\@ \t\n\r]+$/.test(email)) {
        return res.status(400).send('Invalid fields');
    }
    updateVolunteer(req.params.id, { firstname, lastname, email, phone }, (err) => {
        if (err) {
            console.error('Update err:', err);
            return res.status(500).send('Update failed');
        }
        res.redirect('/dashboard');
    });
}

export function removeVolunteer(req, res) {
    deleteVolunteer(req.params.id, (err) => {
        if (err) return res.status(500).send('Delete failed');
        res.redirect('/dashboard');
    });
}

// Get single volunteer
export function getSingleVolunteer(req, res) {
    const { id } = req.params;
    getVolunteerById(id, (err, results) => {
        if (err) {
            console.error('Get volunteer by ID error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0] || {});
    });
}

// Search
export function searchVolunteer(req, res) {
    const keyword = req.query.keyword?.trim();
    if (!keyword) return res.json([]);
    searchVolunteers(keyword, (err, results) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(results);
    });
}
