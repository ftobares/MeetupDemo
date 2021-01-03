class CityModel {
    constructor(pcity_id, pname, pstate_id, platitud, plonguitud){
        this.city_id = pcity_id;
        this.name = pname;
        this.state_id = pstate_id;
        this.latitud = platitud;
        this.longuitud = plonguitud;
    }   
}

exports.CityModel = CityModel;