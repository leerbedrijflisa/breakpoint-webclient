import {HttpClient} from 'aurelia-http-client';

export class OrganizationData {
    static inject() {
        return [ HttpClient];
    }

    constructor(http) {
        this.http = http;
    }

    getSingleReport(params){
        return this.http.get("reports/"+params.id);
    }

    // Send the Data
    postOrganisation(data){ 
        return this.http.post('organizations', data);
    }


    // Sends nothing, this data will never change
    getUsers(){
        return this.http.get('users');
    }

}