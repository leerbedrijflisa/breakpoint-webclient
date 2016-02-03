import {ReportData} from './reportData';
import {LocalStoragePatcher} from '../Resources/localStoragePatcher';
import {Router} from "aurelia-router";

export class Create {
    static inject() {
        return [ReportData, LocalStoragePatcher,Router ];
    }

    constructor(reportData, localStoragePatcher, router) {
        this.data = reportData;
        this.patcher = localStoragePatcher;
        this.router = router;
        this.oldPlatforms = JSON.parse(localStorage.getItem("allPlatforms"));
        this.oldVersions = JSON.parse(localStorage.getItem("allVersions"));
        if(this.oldPlatforms == null) this.oldPlatforms = [ "IE8", "Firefox 9001", "Thor Browser" ];
        this.authToken = JSON.parse(localStorage.getItem("auth_token"));
        this.loggedUser = this.authToken.user;
    }
    
    activate(params) {
        this.params = params;
        this.data.getProject(params, this.loggedUser).then(response => {
            this.projMembers = response.content.members;
            this.groups = response.content.groups;
        }),
        this.data.getTestVersion().then(response => {
                this.report.version = response.content;
        })
        this.report = {
            title: "",
            stepByStep: "",
            expectation: "",
            whatHappened: "",
            reporter: this.loggedUser,
            status: "open",
            priority: "",
            version: "",
            assignedTo: {
                type: "",
                value: ""
            },
            platforms: []
        };
        this.report.platforms.push('');
    }

    checkKey(index, event) {
        if(event.which == 13) {
            this.addInput(index, event);
        }
    }

    addInput(index, event) {
        this.report.platforms[index] = event.target.value;
        if (this.report.platforms[this.report.platforms.length-1]) {
            this.report.platforms.push('');
        }
    }

    removeInput(index) {
        this.report.platforms.splice(index, 1);
    }

    submit(params) {
        // For use of the patcher, give the Old data, New Data and the Local storage key.
        this.patcher.localStoragePatcher(this.oldPlatforms, this.report.platforms, "allPlatforms");
        this.patcher.localStoragePatcher(this.oldVersions, this.report.version, "allVersions");
        this.report.assignedTo.type = getAssignedToType(document.getElementById("assignedTo"));
        if (this.report.priority == "") {
            this.report.priority = "immediately"; 
        };
        this.data.postReport(this.params, this.report).then(response => {
            this.router.navigateToRoute("reports", { organization: this.params.organization, project: this.params.project });
        });
    }
}