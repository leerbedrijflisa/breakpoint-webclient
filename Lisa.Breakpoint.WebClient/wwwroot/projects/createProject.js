import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-http-client';

export class createProject {
    static inject() {
        return [ Router, HttpClient ];
    }

    constructor(router, http) {
        this.router = router;
        this.http = http;
    }

    activate(params) {
        this.params = params;
    }

    create() {
        var data = {
            name: this.name,
            slug: toSlug(this.name),
            organization: this.params.organization,
            members: [
                {
                    role: 'manager',
                    userName: localStorage.getItem("loggedInUser")
                }
            ],
            groups: [
                {
                    "Level": 0,
                    "Name": "tester"
                },
                {
                    "Level": 1,
                    "Name": "developer"
                },
                {
                    "Level": 2,
                    "Name": "manager"
                }
            ],
            projectManager: localStorage.getItem("loggedInUser")
        };

        this.http.post('projects/'+localStorage.getItem("loggedInUser"), data).then( response => {
            this.router.navigateToRoute("projects", { organization: this.params.organization });
        });
    }

}