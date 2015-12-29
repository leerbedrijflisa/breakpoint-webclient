import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

export class user {
    static inject() {
        return [ Router, HttpClient ];
    }

    constructor(router, http) {
        this.router = router;
        this.http = http;
    }

    activate() {
        if (readCookie("userName")) {
            this.router.navigateToRoute("organizations");
        }
    }

    Post() {
        var data = {
            userName: this.userNameRegister,
            fullName: this.fullName
        }

        this.http.post('users', data).then( response => {
            this.Login("afterRegister");
            this.router.navigateToRoute("organizations");
        });
    }

    Login(from) {
        if (!readCookie("userName")) {
            if (from == "afterRegister") {
                var data = {
                    userName: this.userNameRegister
                }
            } else {
                var data = {
                    userName: this.userNameLogin
                }
            }

            this.http.post('token', data).then( response => {
                if (response.content != null) {
                    //setCookie("userName", response.content.userName, 2);
                    localStorage.setItem("user", response.content.user);
                    localStorage.setItem("token", response.content.token);
                    document.getElementById("user_userName").innerHTML = "Logged in as: " + readCookie("userName");
                    this.router.navigateToRoute("organizations");
                }
            });
        }
    }
}