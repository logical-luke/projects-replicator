require('dotenv').config();

const togglClient = require('toggl-api');
const toggl = new togglClient({apiToken: process.env.TOGGL_API_KEY});
const todoist = require('todoist').v8(process.env.TODOIST_API_KEY)
const sleep = require('sleep');

const workspaceId = parseInt(process.env.TOGGL_WORKSPACE_ID);

(async () => {
    while (true) {
        await todoist.sync()

        async function addProjects(projects) {
            console.log(`Adding ${projects.length}  projects`);
            if (projects.length > 0) {
                for (let i = 0; i < projects.length; i++) {
                    await toggl.createProject({
                        "name": projects[i],
                        "wid": workspaceId,
                        "is_private": true
                    }, (err) => {
                        console.log(`Error occurred. Waiting 3 seconds`);
                        sleep.sleep(2);
                        addProjects(projects);
                    });
                    await projects.shift();
                }
            } else {
                console.log(`No projects to add. Sleeping for minute.`);
                sleep.sleep(60);
            }
        }

        let projects = todoist.projects.get()
            .map((project) => {
                return project.name;
            }).filter((projectName) => {
                return projectName !== 'Inbox';
            });
        console.log(`Fetched ${projects.length} from Todoist`);
        await toggl.getWorkspaceProjects(workspaceId, {}, async (err, response) => {
            console.log(`Fetched ${response.length} from Toggl`);
            if (response) {
                const togglProjects = response.map((project) => {
                    return project.name;
                });
                projects = projects.filter((project) => {
                    return togglProjects.indexOf(project) === -1;
                });
            }
            console.log(`${projects.length} projects to add`);
            await addProjects(projects);
        });
    }
})()
