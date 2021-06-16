# Projects Replicator
[![Maintainability](https://api.codeclimate.com/v1/badges/6970b738177d3ec1e3cb/maintainability)](https://codeclimate.com/github/logical-luke/projects-replicator/maintainability)

Replication of tasks and projects between task cloud apps

Supported apps:
* Toggl
* Todoist

## Installation
1. Create own `.env` file using `.env.dist` as base. 
2. Update necessary API key and workspace id 
3. Build image using 
```
docker build . -t logical-luke/projects-replicator
```
4. Start contaiener using
```
docker run -d --restart unless-stopped --name projects-replicator logical-luke/projects-replicator
```
