import {HttpClient} from 'aurelia-http-client';

export class ProjectData {
    static inject() {
        return [ HttpClient];
    }

    constructor(http) {
        this.http = http;
    }

    getProjects(org)   {
        return this.http.get("projects/"+org);
    }
}