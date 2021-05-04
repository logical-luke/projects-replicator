const clickUp = require('../services/clickUpClient');

const listAllClickUpTasks = async () => {
    let tasks = [];
    const teams = await clickUp.listTeams();
    for (const team of teams) {
        const spaces = await clickUp.listSpaces(team.id);
        for (const space of spaces) {
            const folderlessLists = await clickUp.listFolderlessLists(space.id);
            for (const folderlessList of folderlessLists) {
                tasks = tasks.concat(await clickUp.listTasks(folderlessList.id));
            }
            const folders = await clickUp.listFolders(space.id);
            for (const folder of folders) {
                const lists = await clickUp.listLists(folder.id);
                for (const list of lists) {
                    tasks = tasks.concat(await clickUp.listTasks(list.id));
                }
            }
        }
    }
    return tasks;
}
