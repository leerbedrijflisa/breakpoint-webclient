import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

export class login {
    static inject() {
        return [ Router, HttpClient ];
    }

    constructor(router, http) {
        this.router = router;
        this.http = http;
    }

    activate() {
        if (localStorage.getItem("loggedInUser")) {
            this.router.navigateToRoute("organization");
        }
    }

    login() {
        if (!localStorage.getItem("loggedInUser")) {

            var data = {
                userName: this.userName
            }

            this.http.post('token', data).then( response => {
                if (response.content != null) {
                    localStorage.setItem("loggedInUser", response.content.user);
                    localStorage.setItem("token", response.content.token);
                    this.router.navigateToRoute("organizations");
                }
            });
        }
    }
}