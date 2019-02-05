**CURRENTLY IN DEV**

# Silo

### Setup

1. Install silo-cli
```
npm install -g silo-cli
```
To create a new silo instance, run 
```
silo init
```
in an empty folder.
A prompt will run you through setting up a site and creating an admin user
This will also populate the `.env` file with your settings.

Note: `silo dev` will run a local version on the port you specified or default `8080`

### Command line interface

`silo [command] [args]`

| Command | Description |
| --- | --- |
| init | Setups a new silo instance |
| dev		| Runs a dev version on `localhost:8000`with file watching|
| run | Runs a production version |
| resources | Displays a list of current resources |
| data --resource [resource name] | Displays current data stored per resource |

### Silo structure

```
/
├── data
  └── [datafile].json
├── schema
  └── [schema].json
├── cms
├── src
  ├── scripts
  ├── views
    ├── pages
    ├── partials
    ├── layouts
  └── styles
├── dist
├── assets
├── config
  └── settings.js
├── hooks
├── tmp
├── scripts
├──.env
└──
```


### Notes

- All settings are stored in a .env file in the root dir

