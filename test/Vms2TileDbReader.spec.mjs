import { expect } from 'chai';

import { SQLite } from '../src/js/Vms2TileDbReader.js';

describe('Vms2TileDbReader', function () {
    describe('constructor', function () {
        it('get data building polygons', function () {
            const tileDb = new SQLite('test/data/braunschweig.sqlite');
            const tileData = tileDb.getRawData(34686, 21566, 16, 'building', '*', 'polygons');

            expect(tileData.length).to.be.greaterThanOrEqual(4);
        });

        it('get data city points', function () {
            const tileDb = new SQLite('test/data/braunschweig.sqlite');
            const tileData = tileDb.getRawData(34686, 21566, 16, 'place', 'city', 'points');

            expect(tileData.length).to.be.greaterThanOrEqual(4);
        });

        it('get land data', function () {
            const tileDb = new SQLite('test/data/braunschweig.sqlite');
            const tileData = tileDb.getRawData(34686, 21566, 16, 'land');

            expect(tileData.length).to.be.greaterThanOrEqual(4);
        });

        it('get terrain data', function () {
            const tileDb = new SQLite('test/data/braunschweig.sqlite');
            const tileData = tileDb.getRawData(34686, 21566, 16, 'terrain');

            expect(tileData.length).to.be.greaterThanOrEqual(4);
        });

        it('get blue marble data', function () {
            const tileDb = new SQLite('test/data/braunschweig.sqlite');
            const tileData = tileDb.getRawData(34686, 21566, 16, 'blue_marble');

            expect(tileData.length).to.be.greaterThanOrEqual(4);
        });

        it('get data from internal multi tile query', function () {
            const tileDb = new SQLite('test/data/braunschweig.sqlite');
            const tileData = tileDb.getRawData(1083, 673, 12, 'land');

            expect(tileData.length).to.be.greaterThanOrEqual(4);
        });

        it('db file does not exists', function () {
            expect(() => new SQLite('test/data/invalid.sqlite')).to.throw();
        });
    });
});
