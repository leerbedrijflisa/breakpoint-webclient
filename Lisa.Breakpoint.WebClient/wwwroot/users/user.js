import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

export class user {
    static inject() {
        return [Router, HttpClient];
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

    register() {
        this.http.post('users', {
                userName: this.userNameRegister,
                fullName: this.fullName
        }).then( response => {
            this.Login("afterRegister");
        });
    }

    Login(from) {
        if (!readCookie("userName")) {
            if (from == "afterRegister") {
                var data = {
                    userNameLogin: this.userNameRegister
                }
            } else {
                var data = {
                    userNameLogin: this.userNameLogin
                }
            }

            this.http.post("token/", {
                    userName: data.userNameLogin
            }).then( response => {
                if (response.content != null) {
                    localStorage.setItem("auth_token", JSON.stringify(response.content));
                    setCookie("userName", response.content.username, 2);
                    document.getElementById("user_userName").innerHTML = "Logged in as: " + readCookie("userName");
                    this.router.navigateToRoute("organizations");
                }
            });
        }
    }
}