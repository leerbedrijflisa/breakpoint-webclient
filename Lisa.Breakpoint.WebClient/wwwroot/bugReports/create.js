import {ReportData} from './reportData';
import {Router} from "aurelia-router";

export class Create {
    static inject() {
        return [ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
        this.platforms = [];
        this.platforms.push('');
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
            platform: [],
            version: "",
            assignedTo: {
                type: "",
                value: ""
            }
        };
    }

    checkKey(index, event) {
        if(event.which == 13) {
            this.addInput(index, event);
        }
    }

    addInput(index, event) {
        var newPlatfrom = event.target.value;
        if(newPlatfrom === undefined || newPlatfrom === null) {
            return false;
        }
        this.platforms[index] = newPlatfrom;
        event.target.value = '';
        if (this.platforms[this.platforms.length-1]) {
            this.platforms.push('');
        }
    }

    removeInput(index) {
        this.platforms.splice(index, 1);
    }

    submit() {
        this.oldPlatforms = JSON.parse(localStorage.getItem("allPlatforms"));
        if (this.oldPlatforms === null) {
            this.oldPlatforms = [];
        }
        var difference = this.oldPlatforms
            .filter(x => this.platforms.indexOf(x) == -1)
            .concat(this.platforms.filter(x => this.oldPlatforms.indexOf(x) == -1));
        difference.pop();

        if (difference.length > 0) {
            localStorage.setItem("allPlatforms", JSON.stringify(difference));
        }
        this.report.assignedTo.type = getAssignedToType(document.getElementById("assignedTo"));;
        this.data.postReport(this.report).then(response => {
            window.location.reload();
        });
    }
}