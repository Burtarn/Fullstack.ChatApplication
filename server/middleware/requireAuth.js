function requireAuth(req, res, next) {
    if (req.user) {
        next(); 
        } else {
        res.status(401).json({ message: "Du måste vara inloggad för att kommentera" });
        }
    }
    