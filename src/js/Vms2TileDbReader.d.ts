type Type = 'points' | 'lines' | 'polygons';
/**
 * The SQLite class is used to read data from a VMS2 tile database.
 */
export declare class SQLite {
    #private;
    constructor(filename: string);
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
    getRawData(x: number, y: number, z: number, key: string, value?: string, type?: Type): Buffer<ArrayBuffer>;
}
export {};
