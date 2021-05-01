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

const listUserProjects = async () => {
    const workspaces = await listWorkspaces();
    let data = [];
    if (workspaces) {
        let workspacesRequests = [];
        workspaces.forEach((workspace) => {
            workspacesRequests.push(
                api.get(
                    `/workspaces/${workspace.id}/projects`).then((response) => {
                    return response.data
                })
            );
        })
        await Promise.all(workspacesRequests).then((responses) => {
            responses.forEach((projects) => {
                data = data.concat(projects);
            })
        })
    }
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

const createProject = (name) => {
    api.post(`/projects`, {
       project: {
           name: name,
           wid: process.env.TOGGL_TARGET_WORKSPACE_ID
       }
    });
}

module.exports = {
    listUserProjects: listUserProjects,
    listWorkspaces: listWorkspaces,
    getProject: getProject,
    createProject: createProject
};
