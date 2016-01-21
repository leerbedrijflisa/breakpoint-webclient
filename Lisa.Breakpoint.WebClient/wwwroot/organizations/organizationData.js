import {HttpClient} from 'aurelia-http-client';

export class OrganizationData {
    static inject() {
        return [ HttpClient];
    }

    constructor(http) {
        this.http = http;
    }

    getOrganizations(){
        return this.http.get('organizations/');
    }

    postOrganisation(data){ 
        return this.http.post('organizations/', data);
    }

    getUsers(){
        return this.http.get('users');
    }

}