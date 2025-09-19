const validateForm = (email, password) => {
    if (!email || !password) {
        return false;
    }
    return true;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateForm,
};
