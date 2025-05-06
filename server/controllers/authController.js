import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const users = [];

export const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        users.push({ username, password: hashed });

        res.status(201).json({ message: 'User created' });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) throw new Error('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Invalid credentials');

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        next(err);
    }
};
