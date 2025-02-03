type Type = 'points' | 'lines' | 'polygons';
declare class SQLite {
    #private;
    constructor(filename: string);
    /**
     * @returns {Buffer}
     */
    getRawData(x: number, y: number, z: number, key: string, value?: string, type?: Type): Buffer<ArrayBuffer>;
}
export { SQLite };
