import {Router} from 'aurelia-router';
import {ReportData} from './reportData';

export class dashboard {
    static inject() {
        return [ ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
        if( typeof localStorage.getItem("allVersions") == "string" || localStorage.getItem("allVersions") instanceof String)
        {
            this.existingVersions = JSON.parse("[" + localStorage.getItem("allVersions") + "]")[0];
        }
        else{
            this.existingVersions = JSON.parse(localStorage.getItem("allVersions"))[0];
        }
        this.platforms = JSON.parse(localStorage.getItem("allPlatforms"));
        this.authToken = JSON.parse(localStorage.getItem("auth_token"));
        this.loggedUser = this.authToken.user;
    }

    activate(params) {
        this.params = params;
        this.wontfixDisabled = true;
        this.showAssignedTo = [];   
        this.reports = [];
        var thiss = this;
        return Promise.all([
            this.data.getTestVersion().then(response => {
                this.currentVersion = response.content;
            }),
            this.data.getAllVersions().then(response => {
                this.allVersions = response.content;
            }),
            this.data.getGroupFromUser(params, this.loggedUser).then(response => {
                this.canAddOption = false;
                this.loggedUserRole = response.content;
                if (this.loggedUserRole == "manager") {
                    this.wontfixDisabled = null;
                }
                if (this.loggedUserRole === "manager" || this.loggedUserRole ===  "developer" ) {
                    this.canAddOption = true;
                }
                // The default filter when loading the page
                this.firstFilter = "assignedTo="+this.loggedUserRole+"&reporter="+this.loggedUser;
                this.data.getFilteredReports(params, this.loggedUser, this.firstFilter).then( response => {
                    this.reports = this.showAssigned(response.content);
                    this.reportsCount = count(this.reports);
                    if(this.reportsCount > 0){   
                        this.reports.forEach(function(report)  {
                            if (thiss.loggedUserRole == "developer") {
                                report.closedDisabled = true;
                            }
                            if (report.reporter == thiss.loggedUser && thiss.loggedUserRole == "developer") {
                                report.closedDisabled = null;
                            }
                            else {
                                report.closedDisabled = true;
                            }
                        });
                    }
                    })
                }),
            this.data.getProject(params, this.loggedUser).then(response => {
                this.members = response.content.members;
                this.groups = response.content.groups;
                this.projectName = response.content.name;
            })
        ]);
    }

    // shows or hide the assigned to if the assignedto is empty (I believe as everything is required by the api this became irrelevant).
    showAssigned(reports) {
        var reportsLength = count(reports);
        var i;
        for (i = 0; i < reportsLength; i++) {
            if (reports[i].assignedTo.type == "") {
                this.showAssignedTo[i] = false;
            } else {
                this.showAssignedTo[i] = true;
            }
        }
        return reports;
    }

    filterReports() {
        var filters = document.getElementsByClassName('filterItem');
        var filter = "";
        var value = "";

        for (var i = filters.length - 1; i >= 0; i--)
        {
            var filterType = filters[i].id;
                if (filterType == "title") {
                    if (filters[i].value == "") {
                        continue;
                    } else {
                        filter += filters[i].id+"="+filters[i].value+"&";
                    }
                }
                else {
                    var Selvalue = getSelectValue(filterType);
                    // I'll admit this is a bit hacky, it shows the filters assigned to all the groups.. yeah, call it a hotfix it works dammit!
                    if (filterType == "assignedTo" && Selvalue == "all") {
                        filter += filters[i].id+"="+"tester,developer,manager&";
                    } else if (Selvalue != "all") {
                        filter += filters[i].id+"="+Selvalue+"&";
                    }
                }
        }
        if (filter != "")
        {
            filter = filter.slice(0, -1);
            return this.data.getFilteredReports(this.params, filter).then(response => {
                this.reports = response.content;
                this.reportsCount = count(this.reports);
            });
        }
    }

    patchVersion() {
        if(this.existingVersions == null) this.existingVersions = [ "The latest version", "a different version", "Legacy" ];
            if(this.textVersion)    {
                if(this.existingVersions.indexOf(this.textVersion) > -1)    {
                    localStorage.setItem("currentVersion", this.textVersion);
                }
                else {
                    this.existingVersions.push(this.textVersion);
                    localStorage.setItem("allVersions", JSON.stringify(this.existingVersions));
                    localStorage.setItem("currentVersion", this.textVersion);
                }
            }
        }

    // same deal as before in the code, patching is broken so this didn't work at the time of writing this.
    patchStatus(id, index) {
        if (this.reports[index].status == null) {
            this.reports[index].status = document.getElementById("status"+id).options[0].value; 
        };

        switch (this.reports[index].status) {
            case "Fixed":
                var data = {
                    status: this.reports[index].status,
                    reporter: this.reports[index].reporter,
                    assignedTo: {
                        type: "group",
                        value: "tester"
                    }
                };
                break;
            case "Closed":
                var data = {
                    status: this.reports[index].status,
                    reporter: this.reports[index].reporter,
                    assignedTo: {
                        type: "",
                        value: ""
                    }
                };
                break;
            default:
                var data = {
                    status: this.reports[index].status,
                    reporter: this.reports[index].reporter,
                };
                break;
        }
        this.data.patchReport(id, data).then( response => {
            window.location.reload();
        });
    }
}