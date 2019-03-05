import {Db} from "mongodb";
import {Collection} from "../collections/collection";

export class Database {
    constructor(private _db: any) {}

    get name() {
        return this._db.name;
    }

    getCollections() {
        return this._db.listCollections().toArray().then((result) => {
            return result.map((collection) => {
                return new Collection(collection);
            });
        });
    }

    drop() {
        return this._db.dropDatabase();
    }
}
