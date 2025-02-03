var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _SQLite_db, _SQLite_getDetailZoom, _SQLite_packL;
import BetterSqlite3 from 'better-sqlite3';
class SQLite {
    constructor(filename) {
        _SQLite_db.set(this, void 0);
        __classPrivateFieldSet(this, _SQLite_db, new BetterSqlite3(filename, { fileMustExist: true, readonly: true }), "f");
    }
    /**
     * @returns {Buffer}
     */
    getRawData(x, y, z, key, value = '', type = 'polygons') {
        switch (key) {
            case 'land':
            case 'terrain':
            case 'blue_marble':
            case 'elevation':
            case 'bathymetry':
            case 'depth':
                value = key;
                key = 'locr';
                type = 'polygons';
                break;
            default: // ignore
                break;
        }
        const detailZoom = __classPrivateFieldGet(_a, _a, "m", _SQLite_getDetailZoom).call(_a, z, value, type);
        let objectType;
        switch (type) {
            case 'points':
                objectType = 0;
                break;
            case 'lines':
                objectType = 1;
                break;
            case 'polygons':
            default:
                objectType = 2;
                break;
        }
        const maxTileZoom = 16;
        const buffers = [];
        let numberOfTiles = 0;
        let tileWeight = 0;
        let singleTileQuery = 'SELECT x, y, z, data' +
            ' FROM tiles' +
            ' WHERE detail_zoom = :detail_zoom AND object_type = :object_type AND osm_key = :osm_key' +
            ' AND osm_value = :osm_value AND x = :x AND y = :y AND z = :z';
        let multiTileQuery = 'SELECT x, y, z, data' +
            ' FROM tiles' +
            ' WHERE detail_zoom = :detail_zoom AND object_type = :object_type AND osm_key = :osm_key' +
            ' AND osm_value = :osm_value AND x >= :x_min AND x < :x_max  AND y >= :y_min AND y < :y_max AND z = :z';
        for (let queryZ = 0; queryZ <= maxTileZoom; queryZ++) {
            let query = '';
            let queryParams = {};
            if (queryZ <= z) {
                const queryX = x >> (z - queryZ);
                const queryY = y >> (z - queryZ);
                query = singleTileQuery;
                queryParams = {
                    'detail_zoom': detailZoom,
                    'object_type': objectType,
                    'osm_key': key,
                    'osm_value': value,
                    'x': queryX,
                    'y': queryY,
                    'z': queryZ
                };
            }
            else {
                const queryLeftX = x << (queryZ - z);
                const queryTopY = y << (queryZ - z);
                const queryRightX = queryLeftX + (1 << (queryZ - z));
                const queryBottomY = queryTopY + (1 << (queryZ - z));
                query = multiTileQuery;
                queryParams = {
                    'detail_zoom': detailZoom,
                    'object_type': objectType,
                    'osm_key': key,
                    'osm_value': value,
                    'x_min': queryLeftX,
                    'x_max': queryRightX,
                    'y_min': queryTopY,
                    'y_max': queryBottomY,
                    'z': queryZ
                };
            }
            const statement = __classPrivateFieldGet(this, _SQLite_db, "f").prepare(query);
            const rows = statement.all(queryParams);
            if (rows.length > 0) {
                tileWeight += Math.pow(4, maxTileZoom - queryZ);
                for (const index in rows) {
                    if (typeof rows[index] !== 'object' || rows[index] === null) {
                        continue;
                    }
                    const row = rows[index];
                    const dataLength = row.data && row.data instanceof Buffer ? row.data.length : 0;
                    buffers.push(__classPrivateFieldGet(_a, _a, "m", _SQLite_packL).call(_a, row.x));
                    buffers.push(__classPrivateFieldGet(_a, _a, "m", _SQLite_packL).call(_a, row.y));
                    buffers.push(__classPrivateFieldGet(_a, _a, "m", _SQLite_packL).call(_a, row.z));
                    buffers.push(__classPrivateFieldGet(_a, _a, "m", _SQLite_packL).call(_a, detailZoom));
                    buffers.push(__classPrivateFieldGet(_a, _a, "m", _SQLite_packL).call(_a, dataLength));
                    if (dataLength > 0) {
                        buffers.push(row.data);
                    }
                    numberOfTiles++;
                }
            }
            if (tileWeight >= Math.pow(4, maxTileZoom - z)) {
                break;
            }
        }
        buffers.unshift(__classPrivateFieldGet(_a, _a, "m", _SQLite_packL).call(_a, numberOfTiles));
        return Buffer.concat(buffers);
    }
}
_a = SQLite, _SQLite_db = new WeakMap(), _SQLite_getDetailZoom = function _SQLite_getDetailZoom(z, value, type) {
    let detailZooms = [0, 0, 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12, 12, 14];
    switch (value) {
        case 'terrain':
        case 'depth':
            detailZooms = [0, 0, 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12, 12, 12];
            break;
        case 'bathymetry':
        case 'blue_marble':
        case 'elevation':
            detailZooms = [0, 0, 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 10, 10, 10];
            break;
        default: // ignore
            break;
    }
    let detailZoom = detailZooms[Math.max(Math.min(z, 14), 0)];
    if (type === 'points') {
        detailZoom = 14;
    }
    return detailZoom;
}, _SQLite_packL = function _SQLite_packL(value) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(value, 0);
    return buffer;
};
export { SQLite };
//# sourceMappingURL=Vms2TileDbReader.js.map