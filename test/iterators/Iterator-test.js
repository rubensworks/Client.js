/*! @license ©2014 Ruben Verborgh - Multimedia Lab / iMinds / Ghent University */

var Iterator = require('../../lib/iterators/Iterator');

var EventEmitter = require('events').EventEmitter,
    Readable = require('stream').Readable;

describe('Iterator', function () {
  describe('The Iterator module', function () {
    it('should make Iterator objects', function () {
      Iterator().should.be.an.instanceof(Iterator);
    });

    it('should be a Iterator constructor', function () {
      new Iterator().should.be.an.instanceof(Iterator);
    });

    it('should make EventEmitter objects', function () {
      Iterator().should.be.an.instanceof(EventEmitter);
    });

    it('should be a EventEmitter constructor', function () {
      new Iterator().should.be.an.instanceof(EventEmitter);
    });
  });

  describe('An default Iterator instance', function () {
    var iterator = new Iterator();

    it('should throw an error when trying to read', function () {
      (function () { iterator.read(); })
      .should.throw('The _read method has not been implemented.');
    });
  });

  describe('An Iterator instance returning 3 items and then falsy', function () {
    var iterator = new Iterator();
    var items = [1, 2, 3];
    var readCalled = 0;
    iterator._read = function () {
      readCalled++;
      this._push(items.shift() || null);
    };
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should return element 1 on read 1', function () {
      expect(iterator.read()).to.equal(1);
    });

    it('should not have ended after read 1', function () {
      expect(iterator.ended).to.be.false;
    });

    it('should return element 2 on read 2', function () {
      expect(iterator.read()).to.equal(2);
    });

    it('should not have ended after read 2', function () {
      expect(iterator.ended).to.be.false;
    });

    it('should not emit end before read 3', function () {
      endEventEmitted.should.equal(0);
    });

    it('should return element 3 on read 3', function () {
      expect(iterator.read()).to.equal(3);
    });

    it('should emit end after read 3', function () {
      endEventEmitted.should.equal(1);
    });

    it('should have ended after read 3', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should return null on read 4', function () {
      expect(iterator.read()).to.equal(null);
    });

    it('should have ended after read 4', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should return null on read 5', function () {
      expect(iterator.read()).to.equal(null);
    });

    it('should have ended after read 5', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should have called _read only 4 times', function () {
      readCalled.should.equal(4);
    });

    it('should have emited end only once', function () {
      endEventEmitted.should.equal(1);
    });
  });

  describe('An Iterator instance returning 3 items and then calling _end', function () {
    var iterator = new Iterator();
    var items = [1, 2, 3, 4, 5];
    var readCalled = 0;
    iterator._read = function () {
      this._push(items.shift());
      if (++readCalled === 3)
        this._end();
    };
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should return element 1 on read 1', function () {
      expect(iterator.read()).to.equal(1);
    });

    it('should not have ended after read 1', function () {
      expect(iterator.ended).to.be.false;
    });

    it('should return element 2 on read 2', function () {
      expect(iterator.read()).to.equal(2);
    });

    it('should not have ended after read 2', function () {
      expect(iterator.ended).to.be.false;
    });

    it('should not emit end before read 3', function () {
      endEventEmitted.should.equal(0);
    });

    it('should return element 3 on read 3', function () {
      expect(iterator.read()).to.equal(3);
    });

    it('should emit end after read 3', function () {
      endEventEmitted.should.equal(1);
    });

    it('should have ended after read 3', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should return null on read 4', function () {
      expect(iterator.read()).to.equal(null);
    });

    it('should have ended after read 4', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should return null on read 5', function () {
      expect(iterator.read()).to.equal(null);
    });

    it('should have ended after read 5', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should have called _read only 3 times', function () {
      readCalled.should.equal(3);
    });

    it('should have emited end only once', function () {
      endEventEmitted.should.equal(1);
    });
  });

  describe('An Iterator instance returning 8 items', function () {
    var iterator = new Iterator();
    var items = [1, 2, 3, 4, 5, 6, 7, 8];
    var readCalled = 0;
    iterator._read = function () {
      readCalled++;
      this._push(items.shift());
    };

    describe('after construction', function () {
      it('should not buffer any elements', function () {
        readCalled.should.equal(0);
      });
    });

    describe('after reading the first element', function () {
      before(function (done) {
        iterator.read();
        setImmediate(done);
      });

      it('should buffer 4 elements in advance', function () {
        readCalled.should.equal(5);
      });
    });
  });
});

describe('EmptyIterator', function () {
  var EmptyIterator = Iterator.EmptyIterator;

  describe('The EmptyIterator module', function () {
    it('should make EmptyIterator objects', function () {
      EmptyIterator().should.be.an.instanceof(EmptyIterator);
    });

    it('should be a EmptyIterator constructor', function () {
      new EmptyIterator().should.be.an.instanceof(EmptyIterator);
    });

    it('should make Iterator objects', function () {
      EmptyIterator().should.be.an.instanceof(Iterator);
    });

    it('should be a Iterator constructor', function () {
      new EmptyIterator().should.be.an.instanceof(Iterator);
    });

    it('should be accessible through Iterator.empty()', function () {
      Iterator.empty.should.equal(EmptyIterator);
    });
  });

  describe('An EmptyIterator instance', function () {
    var iterator = new EmptyIterator();
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should have emitted end', function () {
      expect(endEventEmitted).to.equal(1);
    });

    it('should have ended', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should not return elements', function () {
      expect(iterator.read()).to.be.null;
    });
  });
});

describe('ArrayIterator', function () {
  var ArrayIterator = Iterator.ArrayIterator;

  describe('The ArrayIterator module', function () {
    it('should make ArrayIterator objects', function () {
      ArrayIterator().should.be.an.instanceof(ArrayIterator);
    });

    it('should be a ArrayIterator constructor', function () {
      new ArrayIterator().should.be.an.instanceof(ArrayIterator);
    });

    it('should make Iterator objects', function () {
      ArrayIterator().should.be.an.instanceof(Iterator);
    });

    it('should be a Iterator constructor', function () {
      new ArrayIterator().should.be.an.instanceof(Iterator);
    });

    it('should be accessible through Iterator.fromArray()', function () {
      Iterator.fromArray.should.equal(ArrayIterator);
    });
  });

  describe('An ArrayIterator instance without arguments', function () {
    var iterator = new ArrayIterator();
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should have emitted end', function () {
      expect(endEventEmitted).to.equal(1);
    });

    it('should have ended', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should not return elements', function () {
      expect(iterator.read()).to.be.null;
    });
  });

  describe('An ArrayIterator instance with an empty array as argument', function () {
    var iterator = new ArrayIterator([]);
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should have emitted end', function () {
      expect(endEventEmitted).to.equal(1);
    });

    it('should have ended', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should not return elements', function () {
      expect(iterator.read()).to.be.null;
    });
  });

  describe('An ArrayIterator instance with an empty array as argument', function () {
    var iterator = new ArrayIterator([]);
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should have emitted end', function () {
      expect(endEventEmitted).to.equal(1);
    });

    it('should have ended', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should not return elements', function () {
      expect(iterator.read()).to.be.null;
    });
  });

  describe('An ArrayIterator instance with a one-element array as argument', function () {
    var iterator = new ArrayIterator([1]);
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should not emit end before read 1', function () {
      endEventEmitted.should.equal(0);
    });

    it('should return element 1 on read 1', function () {
      expect(iterator.read()).to.equal(1);
    });

    it('should emit end after read 1', function () {
      endEventEmitted.should.equal(1);
    });

    it('should have ended after read 1', function () {
      expect(iterator.ended).to.be.true;
    });
  });

  describe('An ArrayIterator instance with a three-element array as argument', function () {
    var iterator = new ArrayIterator([1, 2, 3]);
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should return element 1 on read 1', function () {
      expect(iterator.read()).to.equal(1);
    });

    it('should not have ended after read 1', function () {
      expect(iterator.ended).to.be.false;
    });

    it('should return element 2 on read 2', function () {
      expect(iterator.read()).to.equal(2);
    });

    it('should not have ended after read 2', function () {
      expect(iterator.ended).to.be.false;
    });

    it('should not emit end before read 3', function () {
      endEventEmitted.should.equal(0);
    });

    it('should return element 3 on read 3', function () {
      expect(iterator.read()).to.equal(3);
    });

    it('should emit end after read 3', function () {
      endEventEmitted.should.equal(1);
    });

    it('should have ended after read 3', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should return null on read 4', function () {
      expect(iterator.read()).to.equal(null);
    });

    it('should have ended after read 4', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should return null on read 5', function () {
      expect(iterator.read()).to.equal(null);
    });

    it('should have ended after read 5', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should have emited end only once', function () {
      endEventEmitted.should.equal(1);
    });
  });
});

describe('StreamIterator', function () {
  var StreamIterator = Iterator.StreamIterator;

  describe('The StreamIterator module', function () {
    it('should make StreamIterator objects', function () {
      StreamIterator().should.be.an.instanceof(StreamIterator);
    });

    it('should be a StreamIterator constructor', function () {
      new StreamIterator().should.be.an.instanceof(StreamIterator);
    });

    it('should make Iterator objects', function () {
      StreamIterator().should.be.an.instanceof(Iterator);
    });

    it('should be a Iterator constructor', function () {
      new StreamIterator().should.be.an.instanceof(Iterator);
    });

    it('should be accessible through Iterator.fromStream()', function () {
      Iterator.fromStream.should.equal(StreamIterator);
    });
  });

  describe('A StreamIterator instance without arguments', function () {
    var iterator = new StreamIterator();
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    it('should have emitted end', function () {
      expect(endEventEmitted).to.equal(1);
    });

    it('should have ended', function () {
      expect(iterator.ended).to.be.true;
    });

    it('should not return elements', function () {
      expect(iterator.read()).to.be.null;
    });
  });

  describe('A StreamIterator instance with an empty stream as argument', function () {
    var stream = new Readable({ objectMode: true });
    stream._read = function () {};
    var iterator = new StreamIterator(stream);
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    describe('before the stream was readable', function () {
      it('should not have emitted end', function () {
        expect(endEventEmitted).to.equal(0);
      });

      it('should not have ended', function () {
        expect(iterator.ended).to.be.false;
      });

      it('should not return elements', function () {
        expect(iterator.read()).to.be.null;
      });
    });

    describe('after the stream was readable', function () {
      stream.push(null);

      it('should have emitted end', function () {
        expect(endEventEmitted).to.equal(1);
      });

      it('should have ended', function () {
        expect(iterator.ended).to.be.true;
      });

      it('should not return elements', function () {
        expect(iterator.read()).to.be.null;
      });
    });
  });

  describe('A StreamIterator instance with a one-element stream as argument', function () {
    var stream = new Readable({ objectMode: true });
    stream._read = function () {};
    var iterator = new StreamIterator(stream);
    var readableEventEmitted = 0;
    iterator.on('readable', function () { readableEventEmitted++; });
    var endEventEmitted = 0;
    iterator.on('end', function () { endEventEmitted++; });

    describe('before the stream was readable', function () {
      it('should not have emitted readable', function () {
        expect(readableEventEmitted).to.equal(0);
      });

      it('should not have emitted end', function () {
        expect(endEventEmitted).to.equal(0);
      });

      it('should not have ended', function () {
        expect(iterator.ended).to.be.false;
      });

      it('should not return elements', function () {
        expect(iterator.read()).to.be.null;
      });
    });

    describe('after the stream was readable', function () {
      before(function (done) {
        stream.push(1);
        iterator.on('readable', done);
      });

      it('should not have emitted end', function () {
        expect(endEventEmitted).to.equal(0);
      });

      it('should not have ended', function () {
        expect(iterator.ended).to.be.false;
      });

      it('should return the element', function () {
        expect(iterator.read()).to.equal(1);
      });
    });

    describe('after the stream has ended', function () {
      before(function (done) {
        stream.push(null);
        stream.on('end', done);
      });

      it('should have emitted end', function () {
        expect(endEventEmitted).to.equal(1);
      });

      it('should have ended', function () {
        expect(iterator.ended).to.be.true;
      });

      it('should not return elements', function () {
        expect(iterator.read()).to.be.null;
      });
    });
  });
});