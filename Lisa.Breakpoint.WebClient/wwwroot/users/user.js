﻿import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-http-client';
import {Helpers} from '../Resources/helpers';

export class user {
    static inject() {
        return [Router, HttpClient, Helpers];
    }

    constructor(router, http, helpers) {
        this.router = router;
        this.http = http;
        this.helpers = helpers;
    }

    activate() {
        if (localStorage.getItem("auth_token")) {
            this.router.navigateToRoute("organization");
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
        if (!localStorage.getItem("auth_token")) {
            if (from == "afterRegister") {
                var data = {
                    userName: this.userNameRegister
                }
            } else {
                var data = {
                    userName: this.userNameLogin
                }
            }

            // A simple function that capitalizes any string (only the first character so it only works with single words).
            //data.userName = this.helpers.capitalize(data.userName);

            this.http.post("token/", data).then( response => {
                if (response.content != null) {
                    localStorage.setItem("auth_token", JSON.stringify(response.content));
                    document.getElementById("user_userName").innerHTML = "Logged in as: " + JSON.parse(localStorage.getItem("auth_token"))['user'];
                    this.http.configure(x => {
                        x.withBaseUrl('http://localhost:10791/');      
                        x.withHeader('Content-Type', 'application/json');
                        x.withHeader("Authorization", "Bearer " + response.content.token)});
                    this.router.navigateToRoute("organization");
                }
            });
        }
    }
}