import {Router} from 'aurelia-router';
import {ReportData} from './reportData';

export class changelog {
    static inject() {
        return [ ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
        //this.bugreports = [];
    }

    activate(params) {
        this.loggedUser = readCookie("userName");

        return Promise.all([
            this.data.getChangelog(params).then(response => {
                this.bugreports = response.content;

                console.log(this.bugreports)

               // console.log(this.bugreports.version)

                var i = 0


                this.bugreports.forEach(function(report){
                    console.log(i + " " + report.version)
                    

                    console.log(report.reports)

                    console.log(report.reports.title)

                    i++
                })



            })

        ])


         

    }

}