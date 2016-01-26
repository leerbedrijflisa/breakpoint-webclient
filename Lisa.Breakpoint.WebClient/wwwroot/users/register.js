import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import 'users/login.js';

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

    register() {
        var data = {
            userName: this.userNameRegister,
            fullName: this.fullName
        }

        //POST user information
        this.http.post('users', data).then( response => {
            this.login();
            this.router.navigateToRoute("organizations");
        });
    }

}