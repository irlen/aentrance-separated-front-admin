/**
 * src support multi data types
 * 1. multi points array seperated by |
 *  "114.33,40.22,114.33,40.22,114.33,40.22|114.33,40.22,114.33,40.22,114.33,40.22"
 * 2. just like: 'lng,lat,lnt,lat,lnt,lat,lnt,lat'
 *  "114.33,40.22,114.33,40.22,114.33,40.22"
 */
import createPoint from './createPoint.js';
const getPoints = function (border, originalData = true) {
    let polygons = [];
    let borders = border.split('|');

    borders.forEach((border) => {
        let arr = border ? border.split(',') : [];
        let objArr = [];
        let i = 0;
        while (i < arr.length - 1) {
            let obj = {
                lng: parseFloat(arr[i]),
                lat: parseFloat(arr[i + 1])
            };
            if (originalData) {
                objArr.push(obj);
            } else {
                let bPoint = createPoint(obj);
                objArr.push(bPoint);
            }
            i += 2;
        }
        polygons.push(objArr);
    });
    if (polygons.length == 1) {
        polygons = polygons[0];
    }
    return polygons;
}
export default getPoints;