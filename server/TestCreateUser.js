import { createUser } from '../server/models/userModel.js' 
import bcrypt from 'bcrypt';

async function main() {
    try {
        const saltRounds = 10;
        const password = 'hej123123';
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await createUser('Eriko', hashedPassword);
        console.log('Användare skapad:', newUser);
    } catch (error) {
        console.error('Fel:', error);
    }
}

main();