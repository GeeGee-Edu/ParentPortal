var sinon = require('sinon');
var wolfpack = require('wolfpack');
var sinon = require('sinon');


// We put in the global scope our instantiated model to be used by the controller
global.User = wolfpack('../../../api/models/User');

describe('User Model', function(){

  describe('getCourses', function(){

    // We can test that our controller is calling our Model method with the proper params
    it("should add a user to a given chatroom", function(){
      ChatController.addUser(request, response);

      // Our model Chatroom takes care of adding a user to a chatroom,
      // so we must verify if the controller called it
      expect(Chatroom.addUser.lastCall.args[0]).toBe(request.params.username);
      expect(Chatroom.addUser.lastCall.args[1]).toBe(request.params.chatroom);

    });

    // And we can do our asynchronous test easily

    it("should return a HTTP 200 response if the user was added successfully", function(){
      // Run first part of test asynchronously (jasmine function)
      runs(function(){
        ChatController.addUser(request, response);
      });

      // When the callback executes, it should call res.send, so we should wait for it
      waitsFor(function(){
        return response.send.called;
      });

      // Now we can test if the proper code was sent
      runs(function(){
        expect(response.send.lastCall.calledWith(200)).toBeTruthy();
      });
    });

  });

});
