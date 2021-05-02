const axios = require('axios');

const api = axios.create({
    baseURL: "https://api.track.toggl.com/api/v8",
    timeout: 30000,
});

api.interceptors.request.use(
    async (config) => {
        const basicAuthCredentials = Buffer.from(process.env.TOGGL_API_KEY + ":" + "api_token").toString('base64');
        config.headers.common["Authorization"] = "Basic " + basicAuthCredentials;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const listProjects = async (workspaceId) => {
    let data;
    api.get(
        `/workspaces/${workspaceId}/projects`).then((response) => {
            if (response.data.projects !== undefined) {
                data = data.concat(response.data.projects);
            }
    })
    return data;
}

const listWorkspaces = async () => {
    let data;
    await api.get('/workspaces').then((response) => {
        data = response.data;
    });
    return data;
}

const getProject = async (projectId) => {
    let data;
    await api.get(`/projects/${projectId}`).then((response) => {
        data = response.data;
    });
    return data;
}

const createProject = async (name) => {
    return api.post(`/projects`, {
       project: {
           name: name,
           wid: process.env.TOGGL_TARGET_WORKSPACE_ID
       }
    });
}

const createTask = async (name, projectId) => {
    return api.post(`/tasks`, {
        project: {
            name: name,
            pid: projectId
        }
    });
}

module.exports = {
    listUserProjects: listProjects,
    listWorkspaces: listWorkspaces,
    getProject: getProject,
    createProject: createProject,
    createTask: createTask
};
