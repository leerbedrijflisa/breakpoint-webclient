import {HttpClient} from 'aurelia-http-client';

export class project {
    static inject() {
        return [ HttpClient ];
    }

    constructor(http) {
        this.http = http;
    }

    activate(params) {
        this.params = params;
        this.canEditMember = [];
        this.authToken = JSON.parse(localStorage.getItem("auth_token"));
        this.loggedInUser = this.authToken.user;

        return Promise.all([
            this.http.get('organizations/members/'+params.organization).then(response => {
                var orgMembers = response.content;
                var orgMembersLength = count(orgMembers);
                if (orgMembersLength > 0) {
                    this.usersLeft = true;
                    this.orgMembers = orgMembers;
                } else {
                    this.usersLeft = false;
                }
            }),
            this.http.get('projects/'+params.organization+'/'+params.project).then(response => {
                this.members = this.filterMembers(response.content.members);
                this.groups  = response.content.groups;
            })
        ]);
    }

    addMember(member) {
        var member = getSelectValue("newMember");
        var role = getSelectValue("newRole");

        var patch = {
            Action: "add",
            Field: "members",
            Value: {
                member: member,
                role: role
            }
        };


        this.http.patch('projects/'+this.params.organization+'/'+this.params.project+'/members', patch).then(response => {
            window.location.reload();
        });
    }

    removeMember(member) {
        if (readCookie("userName") != member) {
            var patch = {
                Action: "remove",
                Field: "members",
                Value: {
                    member: member,
                    role: role
                }
            };


            this.http.patch('projects/'+this.params.organization+'/'+this.params.project+'/members', patch).then(response => {
                window.location.reload();
            });
        }
    }
    
    saveMember(member) {
        if (this.loggedInUser != member) {
            var role = getSelectValue("role_"+member);
            var patch = {
                Action: "update",
                Field: "members",
                Value: {
                    member: member,
                    role: role
                }
            };

            this.http.patch('projects/'+this.params.organization+'/'+this.params.project+'/members', patch).then(response => {
                window.location.reload();
            });
        }
    }

    filterMembers(members) {
        var membersLength = count(members);
        var i,
            loggedInUserRole,
            loggedInUserRoleLevel,
            memberRoleLevel;

        for (i = 0; i < membersLength; i++) {
            if (members[i].userName == this.loggedInUser) {
                loggedInUserRole = members[i].role;
                break;
            }
        }

        switch (loggedInUserRole) {
            case "manager":
                loggedInUserRoleLevel = 2;
                break;
            case "developer":
                loggedInUserRoleLevel = 1;
                break;
            case "tester":
                loggedInUserRoleLevel = 0;
                break;
            default:
                loggedInUserRoleLevel = 0;
                break;
        }

        for (i = 0; i < membersLength; i++) {
            switch (members[i].role) {
                case "manager":
                    memberRoleLevel = 2;
                    break;
                case "developer":
                    memberRoleLevel = 1;
                    break;
                case "tester":
                    memberRoleLevel = 0;
                    break;
                default:
                    memberRoleLevel = 0;
                    break;
            }

            if (memberRoleLevel > loggedInUserRoleLevel) {
                this.canEditMember[i] = false;
            } else {
                this.canEditMember[i] = true;
            }            
        }

        return members;
    }
}