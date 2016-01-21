import {Router} from 'aurelia-router';
import {OrganizationData} from './organizationData';

export class Organization {
    static inject() {
        return [ Router, OrganizationData];
    }

    constructor(router, data) {
        this.router = router;
        this.data = data;
        this.userName = readCookie("userName");
    }

    activate() {
        this.data.getOrganizations().then( response => {
            this.organizations = response.content;
        });
    }
}