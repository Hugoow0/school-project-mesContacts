const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateFirstName = (firstName) => {
    return firstName && firstName.trim().length > 0;
};

const validateLastName = (lastName) => {
    return lastName && lastName.trim().length > 0;
};

const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phoneNumber);
};

module.exports = {
    validateEmail,
    validatePassword,
    validateFirstName,
    validateLastName,
    validatePhoneNumber,
};
