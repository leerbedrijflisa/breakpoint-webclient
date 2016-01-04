import {ReportData} from './reportData';
import {Router} from "aurelia-router";

export class Create {
    static inject() {
        return [ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
    }
    
    activate(params) {
        this.data.getProject(params, readCookie("userName")).then(response => {
            this.projMembers = response.content.members;
            this.groups = response.content.groups;
        }),
        this.data.getTestVersion().then(response => {
                this.report.version = response.content;
        })
        this.report = {
            title: "",
            project: params.project,
            organization: params.organization,
            stepByStep: "",
            expectation: "",
            whatHappened: "",
            reporter: readCookie("userName"),
            status: "Open",
            priority: 0,
            platform: "",
            version: "",
            assignedTo: {
                type: "",
                value: ""
            }
        };
    }

    checkKey(event) {
        if(event.which == 13) {
            this.addInput(this.value);
        }
        return false;
    }

    addInput(input) {
        if(this.input == "") {
            alert("You didn't put anything down"); 
            return false;
        }
        alert("You tried to add an input"); 
        this.value = this.input;
        return false;
    }

    getPlatforms() {
        var platform = new Array();
        var platformElement = document.getElementsByClassName("platform");
        for (var i = 0; i < platformElement.length; i++) {
            platform.push(platformElement[i].value);
        }
        return platform;
    }

    submit() {
        this.report.platform = this.getPlatforms();
        this.report.assignedTo.type = getAssignedToType(document.getElementById("assignedTo"));;
        this.data.postReport(this.report).then(response => {
            this.router.navigateToRoute("reports", { organization: this.report.organization, project: this.report.project });
        });
    }
}