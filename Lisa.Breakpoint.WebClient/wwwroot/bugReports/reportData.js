import {HttpClient} from 'aurelia-http-client';

export class ReportData {
    static inject() {
        return [ HttpClient];
    }

    constructor(http) {
        this.http = http;
    }

    // These are the fake web API parts, this will be changed into real links overtime
    getTestVersion() {
        return new Promise (function(resolve, reject) {
            var version = localStorage.getItem("currentVersion");
            if(version == null) {
                version =   "The latest version";
                localStorage.setItem("currentVersion", "The latest version");
            }
            resolve({ content : version });
        });
    }


    getAllVersions() {
        return new Promise (function(resolve, reject) {
            var versions = JSON.parse(localStorage.getItem("allVersions"));
            if(versions == null) {
                versions =  [ "The latest version", "a different version", "Legacy" ];
                localStorage.setItem("allVersions", JSON.stringify(versions));
            }
            resolve({ content : versions });
        });
    }

    // these are the real web API links
    // instructions are provided below :
    // Send the Params
    getSingleReport(params){
        return this.http.get("reports/"+params.id);
    }

    // Send the Params and the user
    getAllReports(params, user){
        return this.http.get("reports/"+params.organization+"/"+params.project);
    }

    // Send the Params, filter and the user
    getFilteredReports(params, user, filter){
        return this.http.get("reports/"+params.organization+"/"+params.project+"?"+filter);

        // {url}/reports?assignedto=developer&reporter=litsher
    }

    // Send the Params and the user
    getProject(params, user) {        
        return this.http.get('projects/'+ params.organization+'/'+ params.project);
    }

    // Send the Params and the user
    getGroupFromUser(params, user) {        
        return this.http.get('users/'+ params.organization+'/'+ params.project+'/'+user);
    }

    // Send the full report 
    postReport(params, report) {
        return this.http.post('reports/'+params.organization+'/'+params.project, report);
    }
    // Send the Id and the changed report
    patchReport(id, data) {
        return this.http.patch('reports/' + id + "/" + readCookie("userName"), data);
    }

}