const axios = require('axios');

const api = axios.create({
    baseURL: "https://app.clickup.com/api/v2",
    timeout: 30000,
});

api.interceptors.request.use(
    async (config) => {
        config.headers.common["Authorization"] = process.env.CLICKUP_API_KEY;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const listTeams = async () => {
    let data = [];
    await api.get(`/team`).then((response) => {
        if (response.data.teams !== undefined) {
            data = response.data.teams;
        }
    });
    return data;
}

const listSpaces = async (teamId) => {
    let data = [];
    await api.get(`/team/${teamId}/space?archived=false`).then((response) => {
        if (response.data.spaces !== undefined) {
            data = response.data.spaces;
        }
    });
    return data;
}

const listFolders = async (spaceId) => {
    let data = [];
    await api.get(`/space/${spaceId}/folder?archived=false`).then((response) => {
        if (response.data.folders !== undefined) {
            data = response.data.folders;
        }
    });
    return data;
}

const listLists = async (folderId) => {
    let data = [];
    await api.get(`/folder/${folderId}/list?archived=false`).then((response) => {
        if (response.data.lists !== undefined) {
            data = response.data.lists;
        }
    });
    return data;
}

const listFolderlessLists = async (spaceId) => {
    let data = [];
    await api.get(`/space/${spaceId}/list?archived=false`).then((response) => {
        if (response.data.lists !== undefined) {
            data = response.data.lists;
        }
    });
    return data;
}


const listTasks = async (listId) => {
    let data = [];
    await api.get(`/list/${listId}/task?archived=false`).then((response) => {
        if (response.data.tasks !== undefined) {
            data = response.data.tasks;
        }
    });
    return data;
}

module.exports = {
    listTeams: listTeams,
    listSpaces: listSpaces,
    listFolders: listFolders,
    listLists: listLists,
    listFolderlessLists: listFolderlessLists,
    listTasks: listTasks
};
