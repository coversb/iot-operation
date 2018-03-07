(function () {
  'use strict';

  describe('Upgrades Route Tests', function () {
    // Initialize global variables
    var $scope,
      UpgradesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UpgradesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UpgradesService = _UpgradesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('upgrades');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/upgrades');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UpgradesController,
          mockUpgrade;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('upgrades.view');
          $templateCache.put('modules/upgrades/client/views/view-upgrade.client.view.html', '');

          // create mock Upgrade
          mockUpgrade = new UpgradesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Upgrade Name'
          });

          // Initialize Controller
          UpgradesController = $controller('UpgradesController as vm', {
            $scope: $scope,
            upgradeResolve: mockUpgrade
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:upgradeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.upgradeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            upgradeId: 1
          })).toEqual('/upgrades/1');
        }));

        it('should attach an Upgrade to the controller scope', function () {
          expect($scope.vm.upgrade._id).toBe(mockUpgrade._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/upgrades/client/views/view-upgrade.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UpgradesController,
          mockUpgrade;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('upgrades.create');
          $templateCache.put('modules/upgrades/client/views/form-upgrade.client.view.html', '');

          // create mock Upgrade
          mockUpgrade = new UpgradesService();

          // Initialize Controller
          UpgradesController = $controller('UpgradesController as vm', {
            $scope: $scope,
            upgradeResolve: mockUpgrade
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.upgradeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/upgrades/create');
        }));

        it('should attach an Upgrade to the controller scope', function () {
          expect($scope.vm.upgrade._id).toBe(mockUpgrade._id);
          expect($scope.vm.upgrade._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/upgrades/client/views/form-upgrade.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UpgradesController,
          mockUpgrade;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('upgrades.edit');
          $templateCache.put('modules/upgrades/client/views/form-upgrade.client.view.html', '');

          // create mock Upgrade
          mockUpgrade = new UpgradesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Upgrade Name'
          });

          // Initialize Controller
          UpgradesController = $controller('UpgradesController as vm', {
            $scope: $scope,
            upgradeResolve: mockUpgrade
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:upgradeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.upgradeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            upgradeId: 1
          })).toEqual('/upgrades/1/edit');
        }));

        it('should attach an Upgrade to the controller scope', function () {
          expect($scope.vm.upgrade._id).toBe(mockUpgrade._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/upgrades/client/views/form-upgrade.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
