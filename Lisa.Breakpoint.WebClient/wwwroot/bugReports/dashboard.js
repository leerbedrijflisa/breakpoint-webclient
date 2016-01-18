﻿import {Router} from 'aurelia-router';
import {ReportData} from './reportData';

export class dashboard {
    static inject() {
        return [ ReportData, Router ];
    }

    constructor(reportData, router) {
        this.data = reportData;
        this.router = router;
        this.existingVersions = JSON.parse(localStorage.getItem("allVersions"));
    }

    activate(params) {
        this.params = params;
        this.wontfixDisabled = true;
        this.showAssignedTo = [];   
        this.loggedUser = readCookie("userName");
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
                this.firstFilter = "member&group";
                this.firstValues = this.loggedUser+"&"+this.loggedUserRole;

                this.data.getFilteredReports(params, this.loggedUser, this.firstFilter, this.firstValues).then( response => {
                    this.reports = this.showAssigned(response.content);
                    this.versions = this.getTestVersions(this.reports);
                    this.reportsCount = count(this.reports);
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
                    })
                }),
            this.data.getProject(params, this.loggedUser).then(response => {
                this.members = response.content.members;
                this.groups = response.content.groups;
                this.projectName = response.content.name;
            })
        ]);
    }
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

    getTestVersions(reports) {
        var reportsLength = count(reports);
        var versions = [];
        var i;

        for (i = 0; i < reportsLength; i++) {
            if (reports[i].version != "") {
                versions.push(reports[i].version);
            }
        }

        return versions.filter(function(item, pos) {
            return versions.indexOf(item) == pos;
        })
    }

    filterReports() {
        var filters = document.getElementsByClassName('filterItem');
        var filter = "";
        var value = "";

        for (var i = filters.length - 1; i >= 0; i--)
        {
            var filterType = filters[i].id;
            if (filterType == "titleFilter") {
                if (filters[i].value == "") {
                    continue;
                } else {
                    filter += filters[i].id+"&";
                    value += filters[i].value+"&";
                }
            } else {
                filter += filters[i].id+"&";
                value += getSelectValue(filterType)+"&";
            }
        }
        filter = filter.slice(0, -1);
        value  = value.slice(0, -1);

        return this.data.getFilteredReports(this.params, readCookie("userName"), filter, value).then(response => {
            this.reports = response.content;
            this.reportsCount = count(this.reports);
        });
    }

    patchVersion() {
        if(this.existingVersions == null) this.existingVersions = [ "The latest version", "a different version", "Legacy" ];
            if(this.textVersion)
            {
                if(this.existingVersions.indexOf(this.textVersion) > -1)    {
                    localStorage.setItem("currentVersion", this.textVersion);
                    window.location.reload();
                }
                else {
                    this.existingVersions.push(this.textVersion);
                    localStorage.setItem("allVersions", JSON.stringify(this.existingVersions));
                    localStorage.setItem("currentVersion", this.textVersion);
                    window.location.reload();
                }
            }
        }

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