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
            this.login("afterRegister");
        });
    }

    login(from) {
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

            this.http.post("token/", data).then( response => {
                if (response.content != null) {
                    localStorage.setItem("auth_token", JSON.stringify(response.content));
                    setCookie("userName", response.content.user, 2);
                    document.getElementById("user_userName").innerHTML = "Logged in as: " + readCookie("userName");
                    this.http.configure(x => {
                        x.withBaseUrl('http://localhost:10791/');      
                        x.withHeader('Content-Type', 'application/json');
                        x.withHeader("Authorization", "Bearer " + response.content.token)});
                    this.router.navigateToRoute("organizations");
                }
            });
        }
    }
}