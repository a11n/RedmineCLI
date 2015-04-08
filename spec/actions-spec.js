describe('actions.js', function() {
  var rewire = require("rewire");
  var actions = rewire("../module/actions.js");

  var redmine = actions.__get__('redmine');
  var printer = actions.__get__('printer');

  it("should handle connect with valid apiKey", function() {
    var user = {user: 'name'};
    spyOn(redmine, 'connect').andReturn(user);
    spyOn(printer, 'printSuccessfullyConnected');

    actions.handleConnect('url', 'apiKey');

    expect(redmine.connect).toHaveBeenCalledWith('url', 'apiKey');
    expect(printer.printSuccessfullyConnected).toHaveBeenCalledWith('url', user);
  });
});
