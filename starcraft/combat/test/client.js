
export default class Client {

  commands = [];

  action(command) {
    this.commands.push(command);
  }

}
