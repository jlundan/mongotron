import * as fs from "fs";

export class FileUtils {
    public static writeJson(path, obj): Promise<void> {
        return FileUtils.writeRaw(path, JSON.stringify(obj));
    }

    public static readJson(path): Promise<any> {
        return FileUtils.readRaw(path).then((contents) => {
            return JSON.parse(contents);
        });
    }

    public static writeRaw(path, fileData): Promise<void> {
        return new Promise((resolve, reject) => {
            const parentDir = path.dirname(path);
            fs.access(parentDir, fs.constants.F_OK, (doesNotExist) => {
                if (doesNotExist) {
                    fs.mkdir(parentDir, () => {
                        return FileUtilHelpers.writeFileInternal(path, fileData, resolve, reject);
                    })
                }
                return FileUtilHelpers.writeFileInternal(path, fileData, resolve, reject);
            });
        });
    }

    public static readRaw(path): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, contents) => {
                if(err) {
                    return reject(err);
                }
                resolve(contents.replace(/^\uFEFF/, '')); // Strip BOM
            })
        });
    }

    // createDirSync(path) {
    //     var dirExists = false;
    //
    //     try {
    //         var stats = fs.lstatSync(path);
    //
    //         if (stats.isDirectory()) {
    //             dirExists = true;
    //         }
    //     } catch (e) {
    //         //eat the error because you'll get an error if the dir doesn't exists,
    //         //in which case we should create the dir
    //         logger.warn(e);
    //     }
    //
    //     if (!dirExists) {
    //         try {
    //             fs.mkdirSync(path);
    //         } catch (e) {
    //             //eat the error
    //             logger.warn(e);
    //         }
    //     }
    // }
    //
    // createFileSync(path, fileData) {
    //     var fileExists = false;
    //     fileData = fileData || '';
    //
    //     try {
    //         var stats = fs.lstatSync(path);
    //
    //         if (stats.isFile()) {
    //             fileExists = true;
    //         }
    //     } catch (e) {
    //         //eat the error because you'll get an error if the dir doesn't exists,
    //         //in which case we should create the dir
    //     }
    //
    //     if (!fileExists) {
    //         try {
    //             fs.writeFileSync(path, fileData);
    //         } catch (e) {
    //             //eat the error
    //             logger.warn(e);
    //         }
    //     }
    // }
    //
    // readJsonFile(path) {
    //     return new Promise((resolve, reject) => {
    //         jsonfile.readFile(path, (err, data) => {
    //             if (err && !(err.message && err.message === 'Unexpected end of input')) return reject(err);
    //             return resolve(data);
    //         });
    //     });
    // }
    //
    // writeJsonFile(path, fileData) {
    //     return new Promise((resolve, reject) => {
    //         jsonfile.writeFile(path, fileData, (err, data) => {
    //             if (err) return reject(err);
    //             return resolve(data);
    //         });
    //     });
    // }

}
class FileUtilHelpers {
    public static writeFileInternal(path, fileData, resolve, reject) {
        fs.writeFile(path, fileData, (err) => {
            if (err) { return reject(err) };
            return resolve();
        });
    }
}
