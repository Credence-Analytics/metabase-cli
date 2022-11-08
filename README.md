# METABASE CLI

- Command Line Interface for export/import of dashboard/question  of one [Metabase v0.41](https://www.metabase.com/) server to another.
- The tools uses standard [Metabase API](https://www.metabase.com/docs/latest/api-documentation) to export the data 

# Prerequisites

- Node.js ([Download Link](https://nodejs.org/en/download/))
  > Tried and tested on version 12.18.2

# Installation

- To install, run the following command
  ```bash
  npm install -g @credenceanalytics/metabasecli
  ```

- Once it is installed, run below metioned command from any directory
  ```bash
  metabase
  ```
-  And you should get an output like below :

    ![metabase-initial](./assets/metabase-initial.png)

# Commands

> PREREQUISITE : Your `metabase` application must be running either on local machine or on remote server.

## `metabase init`

- Run below command to initialize metabase credentials
  ```
  USAGE
    $ metabase init
  ```

    ![metabase-init](./assets/metabase-init.gif)

## `metabase export`

- Run below command, for export of question or dashboard from metabase

  - Dashboard
    - Show list of dashboards
    - Select one dashboard
  - Question
    - Show list of questions
    - Select one question

  ```
  USAGE
    $ metabase export
  ```
  ![metabase-export](./assets/metabase-export.gif)

## `metabase import`

> PREREQUISITE : You should have exported file of question or dashboard in `.json` format.

- Make sure that the file you are importing has following properties in it.
  - `type` property and it's value should be either `Q` or `D`.
  - `data`

- Provide a valid path to the file you want to import, it must be in `.json` format.
- Database
  - Show list of connected databases to the metabase.
  - Select appropriate database
  ```
  USAGE
    $ metabase import
  ```
  
  ![metabase-import](./assets/metabase-import.gif)

  ***Note*** : Simple textbox question exported in dashboard, will not be imported.

## `metabase delete`

- To delete a question or dashboard from metabase

- Dashboard
  - Show list of dashboards
  - Select one dashboard
- Question
  - Show list of questions
  - Select one question

  ```
  USAGE
    $ metabase delete
  ```

  ![metabase-delete](./assets/metabase-delete.gif)

# License
- Metabase CLI is released under the [MIT License](https://opensource.org/licenses/MIT).

<!-- commandsstop -->
