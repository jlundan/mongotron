import {Connection} from "../../services/connections/connection";


export class Connections {
    private _connections: Connection[];

    constructor(){
        this._connections =[];
    }

    get connections() {
        return this._connections;
    }

    // attached(){
    //     Connection.newConnection("mongodb://localhost:27017").then((connection) => {
    //         this._connections.push(connection);
    //         return connection.getDatabases();
    //     }).then((databases) => {
    //         databases.forEach((db) => {
    //             //console.log(db.name);
    //         });
    //     });
    // }
}
