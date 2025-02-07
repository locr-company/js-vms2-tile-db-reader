import BetterSqlite3 from 'better-sqlite3';

type Type = 'points'|'lines'|'polygons';

class SQLite
{
    readonly #db: BetterSqlite3.Database;

    constructor(filename: string) {
        this.#db = new BetterSqlite3(filename, { fileMustExist: true, readonly: true });
    }

    static #getDetailZoom(z: number, value: string, type: Type): number
    {
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
    }

    static #getObjectType(type: Type): number
    {
        switch (type) {
            case 'points':
                return 0;
            case 'lines':
                return 1;
            case 'polygons':
            default:
                return 2;
        }
    }

    /**
     * Get the specified data from the database. \
     * This method can throw an exception, if the $type-parameter is invalid or if the internal database query failed.
     *
     * ```js
     * import { SQLite } from '@locr-company/vms2-tile-db-reader';
     *
     * const tileDb = new SQLite('data/world.sqlite');
     * const tileData = tileDb.getRawData(34686, 21566, 16, 'building', '*', 'polygons');
     * ```
     *
     * @returns {Buffer}
     */
    getRawData(x: number, y: number, z: number, key: string, value: string = '', type: Type = 'polygons'): Buffer<ArrayBuffer> {
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

        const detailZoom = SQLite.#getDetailZoom(z, value, type);
        const objectType = SQLite.#getObjectType(type);

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
            let queryParams: any = {};

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
            } else {
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

            const statement = this.#db.prepare(query);
            const rows = statement.all(queryParams);

            if (rows.length > 0) {
                tileWeight += Math.pow(4, maxTileZoom - queryZ);

                for (const index in rows) {
                    if (typeof rows[index] !== 'object' || rows[index] === null) {
                        continue;
                    }

                    const row: any = rows[index];

                    const dataLength = row.data && row.data instanceof Buffer ? row.data.length : 0;

                    buffers.push(SQLite.#packL(row.x));
                    buffers.push(SQLite.#packL(row.y));
                    buffers.push(SQLite.#packL(row.z));
                    buffers.push(SQLite.#packL(detailZoom));
                    buffers.push(SQLite.#packL(dataLength));

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

        buffers.unshift(SQLite.#packL(numberOfTiles));

        return Buffer.concat(buffers);
    }

    static #packL(value: number) {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32LE(value, 0);
        return buffer;
    }
}

export {
    SQLite
}