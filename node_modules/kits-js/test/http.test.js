import 'babel-polyfill';
import {
    http
} from '../lib/index.js';

jest.setTimeout(30000);

describe('test object operate funcs', () => {
    test('jsonp request', (done) => {
        http.fetch({
            url: 'http://jsonplaceholder.typicode.com/users/1',
            method: 'GET',
            success: (rs) => {
                expect(rs).toBeInstanceOf(Object);
                expect(rs.id).toBeInstanceOf(Number);
                expect(rs).toHaveProperty('address.geo');
                done();
            },
            fail: (rs) => {
                expect(rs).toBeInstanceOf(Object);
                done();
            }
        });
    });
});