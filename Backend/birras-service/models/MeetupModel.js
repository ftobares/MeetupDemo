class MeetupModel {
    constructor(powner, ptitle, pdate, pdescription, pcategories, pid, penrolled){
        this.owner = powner;
        this.title = ptitle;
        this.date = pdate;
        this.description = pdescription;
        this.categories = pcategories;
        this.id = pid;
        this.enrolled = penrolled;
    }
}

exports.MeetupModel = MeetupModel;