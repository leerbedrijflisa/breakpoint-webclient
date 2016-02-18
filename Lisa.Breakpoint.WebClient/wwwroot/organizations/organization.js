import {Router} from 'aurelia-router';
import {OrganizationData} from './organizationData';

export class Organization {
    static inject() {
        return [ Router, OrganizationData];
    }

    constructor(router, data) {
        this.router = router;
        this.data = data;
    }

    activate() {
        this.data.getOrganizations().then( response => {
            this.organizations = response.content;
        });
    }
}