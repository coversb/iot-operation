'use strict';

describe('Upgrades E2E Tests:', function () {
  describe('Test Upgrades page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/upgrades');
      expect(element.all(by.repeater('upgrade in upgrades')).count()).toEqual(0);
    });
  });
});
