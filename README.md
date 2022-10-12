oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g metabase
$ metabase COMMAND
running command...
$ metabase (--version)
metabase/0.0.0 darwin-x64 node-v16.15.1
$ metabase --help [COMMAND]
USAGE
  $ metabase COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`metabase hello PERSON`](#metabase-hello-person)
* [`metabase hello world`](#metabase-hello-world)
* [`metabase help [COMMAND]`](#metabase-help-command)
* [`metabase plugins`](#metabase-plugins)
* [`metabase plugins:install PLUGIN...`](#metabase-pluginsinstall-plugin)
* [`metabase plugins:inspect PLUGIN...`](#metabase-pluginsinspect-plugin)
* [`metabase plugins:install PLUGIN...`](#metabase-pluginsinstall-plugin-1)
* [`metabase plugins:link PLUGIN`](#metabase-pluginslink-plugin)
* [`metabase plugins:uninstall PLUGIN...`](#metabase-pluginsuninstall-plugin)
* [`metabase plugins:uninstall PLUGIN...`](#metabase-pluginsuninstall-plugin-1)
* [`metabase plugins:uninstall PLUGIN...`](#metabase-pluginsuninstall-plugin-2)
* [`metabase plugins update`](#metabase-plugins-update)

## `metabase hello PERSON`

Say hello

```
USAGE
  $ metabase hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/fjorn-x/metabase/blob/v0.0.0/dist/commands/hello/index.ts)_

## `metabase hello world`

Say hello world

```
USAGE
  $ metabase hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ metabase hello world
  hello world! (./src/commands/hello/world.ts)
```

## `metabase help [COMMAND]`

Display help for metabase.

```
USAGE
  $ metabase help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for metabase.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

## `metabase plugins`

List installed plugins.

```
USAGE
  $ metabase plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ metabase plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.1/src/commands/plugins/index.ts)_

## `metabase plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ metabase plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ metabase plugins add

EXAMPLES
  $ metabase plugins:install myplugin 

  $ metabase plugins:install https://github.com/someuser/someplugin

  $ metabase plugins:install someuser/someplugin
```

## `metabase plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ metabase plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ metabase plugins:inspect myplugin
```

## `metabase plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ metabase plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ metabase plugins add

EXAMPLES
  $ metabase plugins:install myplugin 

  $ metabase plugins:install https://github.com/someuser/someplugin

  $ metabase plugins:install someuser/someplugin
```

## `metabase plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ metabase plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ metabase plugins:link myplugin
```

## `metabase plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ metabase plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ metabase plugins unlink
  $ metabase plugins remove
```

## `metabase plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ metabase plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ metabase plugins unlink
  $ metabase plugins remove
```

## `metabase plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ metabase plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ metabase plugins unlink
  $ metabase plugins remove
```

## `metabase plugins update`

Update installed plugins.

```
USAGE
  $ metabase plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
