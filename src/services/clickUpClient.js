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
    let data;
    await api.get(`/team`).then((response) => {
        if (response.data.teams !== undefined) {
            data = response.data.teams;
        }
    });
    return data;
}

const listSpaces = async () => {
    const teams = await listTeams();
    let data = [];
    if (teams) {
        let spacesRequests = [];
        teams.forEach((team) => {
            spacesRequests.push(
                api.get(
                    `/team/${team.id}/space?archived=false`).then((response) => {
                    return response.data
                })
            );
        });
        await Promise.all(spacesRequests).then((responses) => {
            responses.forEach((spaces) => {
                if (spaces.spaces !== undefined) {
                    data = data.concat(spaces.spaces);
                }
            })
        })
        return data;
    }
}

module.exports = {
    listTeams: listTeams,
    listSpaces: listSpaces
};
