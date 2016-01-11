import {ReportData} from './reportData';
import {Router} from "aurelia-router";

export class Create {
    static inject() {
        return [ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
        this.oldPlatforms = JSON.parse(localStorage.getItem("allPlatforms"));
        if(this.oldPlatforms == null) this.oldPlatforms = [ "IE8", "Firefox 9001", "Thor Browser" ];
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
        this.report.platform.push('');
    }

    checkKey(index, event) {
        if(event.which == 13) {
            this.addInput(index, event);
        }
    }

    addInput(index, event) {
        this.report.platform[index] = event.target.value;
        if (this.report.platform[this.report.platform.length-1]) {
            event.target.value = '';
            this.report.platform.push('');
        }
    }

    removeInput(index) {
        this.report.platform.splice(index, 1);
    }

    submit() {
        if(!document.getElementById("input0").value == "")  {
            this.report.platform[0] = document.getElementById("input0").value;
        }
        if (this.oldPlatforms === null) {
            this.oldPlatforms = [];
        }
        if (this.report.platform.length == 1 && this.report.platform[0] == "")   {
            this.report.platform[0] = "not specified";
        }
        var difference = this.oldPlatforms
            .filter(x => this.report.platform.indexOf(x) == -1)
            .concat(this.report.platform.filter(x => this.oldPlatforms.indexOf(x) == -1));

        for(var i=0;i<difference.length;i++){
            if(difference[i] === "")   {
                difference.splice(i, 1);
            }
        }

        if (difference.length > 0) {
            localStorage.setItem("allPlatforms", JSON.stringify(difference));
        }
        this.report.assignedTo.type = getAssignedToType(document.getElementById("assignedTo"));;
        this.data.postReport(this.report).then(response => {
            window.location.reload();
        });
    }
}