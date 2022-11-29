import bcrypt from 'bcrypt';

const matchPassword = async function (enteredPassword, password) {
    return await bcrypt.compare(enteredPassword, password)
}

export default matchPassword;