import {ProjectData} from './projectData';

export class project {
    static inject() {
        return [ProjectData ];
    }

    constructor(data) {
        this.data = data;
    }

    activate(params) {
        this.params = params;
        this.organization = this.params.organization; 
        this.data.getProjects(params).then( response => {
            this.projects = response.content;
        });
    }
}