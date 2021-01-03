class StateModel {
    constructor(pstate_id, pname, pcountry_id){
        this.state_id = pstate_id;
        this.name = pname;
        this.country_id = pcountry_id;      
    }   
}

exports.StateModel = StateModel;