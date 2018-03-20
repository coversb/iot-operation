(function () {
  'use strict';

  // PasswordValidator service used for testing the password strength
  angular
    .module('users.services')
    .factory('PasswordValidator', PasswordValidator);

  PasswordValidator.$inject = ['$window'];

  function PasswordValidator($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    var service = {
      getResult: getResult,
      getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
      var result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      var popoverMsg = '密码长度至少' + owaspPasswordStrengthTest.configs.minLength + '位，需至少包含数字、小写字母、大写字母或特殊符号中的' + owaspPasswordStrengthTest.configs.minOptionalTestsToPass + '种';

      return popoverMsg;
    }
  }

}());
