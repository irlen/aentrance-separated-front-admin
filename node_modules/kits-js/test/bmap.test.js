import 'babel-polyfill';
import {
    bmap
} from '../lib/index.js';

var multiPointString = '114.33,40.22,114.33,40.22,114.33,40.22|114.33,40.22,114.33,40.22,114.33,40.22';
var stringPoint = '114.33,40.22';

describe('test object operate funcs', () => {
    test('parse multi point array string', () => {
        let ps = bmap.getPoints(multiPointString, true);
        expect(ps).toBeInstanceOf(Array);
        expect(ps).toHaveLength(2);
    })

    test('parse string to Object', () => {
        let p = bmap.createPoint(stringPoint, true);
        expect(p).toBeInstanceOf(Object);
        expect(p).toHaveProperty('lng');
        expect(p).toHaveProperty('lat');
    });
});