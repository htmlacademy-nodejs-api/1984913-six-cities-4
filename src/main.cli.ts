
import CLIApplication from './app/cli.js';
import HelpCommand from './core/cli-command/help.command.js';
import VersionCommand from './core/cli-command/version.command.js';

const commandManager = new CLIApplication();
commandManager.registerCommands([
  new HelpCommand, new VersionCommand
]);
commandManager.processCommand(process.argv);
