describe('testing the utils factory', () => {
  // let service = null;

  beforeEach(() => {
    module('base');

    inject(() => {
      // service = _service_;
    });
  });

  it('should be hot', () => {
    const original = 'hot';
    
    expect(original).toEqual('hot');
    
  });

});