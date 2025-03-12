export const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 7; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};