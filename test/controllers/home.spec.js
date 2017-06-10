describe('homeCtrl', () => {

  let scope;

  beforeEach(() => {
    module('base');
    module('home');

    inject(($rootScope, $controller) => {
      scope = $rootScope.$new();
      $controller('homeCtrl', { $scope: scope });
    })
  });

  it('should be awesome', () => {
    scope.thing = 'awesome';
    expect(scope.thing).toEqual('awesome');
  });

});