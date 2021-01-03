class UserModel {
    constructor(pemail, ppass, pname, psurname, pcountry, pcity, pid){
        this.email = pemail;
        this.pass = ppass;
        this.name = pname;
        this.surname = psurname;
        this.country = pcountry;
        this.city = pcity;
        this.meetupsOwnership = '';
        this.meetupsRegistered = '';
        this.id = pid;
    }
}

exports.UserModel = UserModel;