import {MongoClient} from "mongodb";
import {Database} from "../databases/database";

export class Connection {
    private readonly _url: string;
    private _db: string;
    private _mongoClient: MongoClient;

    public static newConnection(url: string, db?: string) {
        return MongoClient.connect(url, {useNewUrlParser: true}).then((client) => {
            return new Connection(client, url, db);
        });
    }

    public static testConnection(url: string) {
        return MongoClient.connect(url, {useNewUrlParser: true}).then((client) => {
            return client.close();
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    constructor(mongoClient: MongoClient, url: string, db?: string) {
        this._url = url;
        this._db = db || null;
        this._mongoClient = mongoClient;
    }

    get url() {
        return this._url;
    }

    getDatabases(): Promise<Database[]>{
        return this._mongoClient.db(this._db || "local").admin().listDatabases().then((result) => {
            return result.databases.map((db) => {
                return new Database(db);
            });
        });
    }

    close() {
        return this._mongoClient.close();
    }
}
