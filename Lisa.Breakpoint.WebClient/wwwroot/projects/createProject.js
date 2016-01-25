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
        this.authToken = JSON.parse(localStorage.getItem("auth_token"));
    }

    activate(params) {
        this.params = params;
    }

    create() {
        var data = {
            name: this.name,
            currentVersion: this.currentVersion,
            groups: [
                {
                    "Level": 0,
                    "Name": "tester",
                    "Disabled": false
                },
                {
                    "Level": 1,
                    "Name": "developer",
                    "Disabled": false
                },
                {
                    "Level": 2,
                    "Name": "manager",
                    "Disabled": false
                }
            ],
            members: [
                {
                    role: 'manager',
                    userName: this.authToken.user
                }
            ],
        };

        this.http.post('projects/'+this.params.organization, data).then( response => {
            this.router.navigateToRoute("projects", { organization: this.params.organization });
        });
    }
}