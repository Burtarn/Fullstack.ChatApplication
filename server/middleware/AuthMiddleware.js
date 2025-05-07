import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Ingen token, åtkomst nekad' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Ogiltig token' });
    req.user = user; 
    next();
    });
};
export default authenticateJWT;