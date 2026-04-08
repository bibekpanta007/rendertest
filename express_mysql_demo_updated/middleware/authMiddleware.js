export function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

export function isAdmin(req, res, next) {
    if (req.session.user?.role === 'admin') return next();
    res.status(403).send('Access Denied: Admin Only');
}

export function validateInput(req, res, next) {
    // Basic sanitization/validation helper
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }
    next();
}
