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
        data = response.data;
    });
    return data;
}

module.exports = {
    listTeams: listTeams
};
