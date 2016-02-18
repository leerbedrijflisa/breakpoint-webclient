import {Router} from 'aurelia-router';
import {OrganizationData} from './organizationData';

export class Create {
    static inject() {
        return [ Router, OrganizationData];
    }

    constructor(router, data) {
        this.router = router;
        this.data = data;
    }

    activate() {
        //Gets the users from the Api
        this.data.getUsers().then(response => {
            console.log(JSON.parse(response.content))
            this.users = response.content;
        });
    }
    
    submit() {
        var newOrganization = {
            name: this.name,
            members: this.members
        };

        this.data.postOrganisation(newOrganization).then(response => {
            this.router.navigateToRoute("organization");
        });
    }
}