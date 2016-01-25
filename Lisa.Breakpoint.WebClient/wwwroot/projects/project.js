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
        this.data.getProjects(params).then( response => {
            this.projects = response.content;
            this.organization = params.organization; 
        });
    }
}