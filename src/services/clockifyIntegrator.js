const clickUp = require('../services/clickUpClient');

const listAllClickUpTasks = async () => {
    let tasks = [];
    const teams = await clickUp.listTeams();
    for (const team of teams) {
        const spaces = await clickUp.listSpaces(team.id);
        for (const space of spaces) {
            tasks.push(await clickUp.listFolderlessLists(space.id));
            const folders = await clickUp.listFolders(space.id);
            for (const folder of folders) {
                tasks.push(await clickUp.listLists(folder.id));
            }
        }
    }
    return tasks;
}
