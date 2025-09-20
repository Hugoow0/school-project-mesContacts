const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validatePhone = (phone) => {
    return phone.length >= 10;
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,
};
