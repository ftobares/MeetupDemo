class CategoryModel {
    constructor(pid, ptitle, phashtag, pdescription){
        this.id = pid;
        this.title = ptitle;
        this.hashtag = phashtag;
        this.description = pdescription;       
    }   
}

exports.CategoryModel = CategoryModel;