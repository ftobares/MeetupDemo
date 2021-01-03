const MAIL_FORMAT = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";

const validateEmail = (mail) => {
    let regex = new RegExp(MAIL_FORMAT);
    if (regex.test(mail)) {
        return true;
    }    
    return false;
}

module.exports = {
    validateEmail
};