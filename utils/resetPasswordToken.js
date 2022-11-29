import crypto from 'crypto';

const resetPasswordToken = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 30 * 60 * 1000
    return {
        resetPasswordToken,
        resetPasswordExpire
    }
}

export default resetPasswordToken;