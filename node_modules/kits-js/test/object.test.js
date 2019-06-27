import 'babel-polyfill';
import {
    obj
} from '../lib/index.js';

var o1 = {
    a: {
        aa: {
            aaa: 1
        },
        bb: {
            bbb: 2
        }
    },
    b: 'hello',
    e: 'o2 dont have',
    g: 'o2 different',
}
var o2 = {
    a: {
        aa: {
            aaa: 'first'
        },
        bb: {
            bbb: 2
        }
    },
    c: 'daniel',
    f: 'o1 dont have',
    g: 'different',
}
describe('test object operate funcs', () => {
    test('obj.merge two object', () => {
        let mo = obj.merge(o1, o2);
        expect(mo).toBeInstanceOf(Object);
        expect(mo).toHaveProperty('a.aa.aaa');
        expect(mo).toHaveProperty('a');
        expect(mo).toHaveProperty('c');
    });

    test('diff two object', () => {
        let d = obj.diff(o1, o2);
        expect(d).toBeInstanceOf(Object);
        expect(d).toHaveProperty('a.bb.bbb');
        expect(d.e).toBe(undefined);
        expect(d.g).toBe('different');
    });

    test('obj.deepClone Object', () => {
        let c = obj.deepClone(o1);
        expect(c).toEqual(o1);
    });

    test('obj.deepClone Array', () => {
        var a1 = [{
            1: 3
        }, {
            hello: {
                name: 'daniel'
            }
        }];
        let c = obj.deepClone(a1);
        expect(c).toEqual(a1);
    });
});