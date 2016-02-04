import {Router} from 'aurelia-router';
import {ReportData} from './reportData';

export class changelog {
    static inject() {
        return [ ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
    }

    activate(params) {
        this.authToken = JSON.parse(localStorage.getItem("auth_token"));
        this.loggedUser = this.authToken.user;

        return Promise.all([
            this.data.getChangelog(params).then(response => {
                this.bugreports = response.content;
                var i = 0;
                this.bugreports.forEach(function(versions){
                    versions.reports.forEach(function(report){
                        console.log(report.title)
                        console.log(report.whathappened)

                    });
                i++;
                })
                })
        ])
    }
}