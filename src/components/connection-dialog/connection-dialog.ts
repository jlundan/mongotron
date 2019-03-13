import {autoinject} from "aurelia-dependency-injection";
import {Connection} from "../../state/connections";
import { DialogController } from 'aurelia-dialog';

@autoinject()
export class ConnectionDialog {
    public _connection: Connection;
    private _isConnecting: boolean;

    constructor(private _dialogController: DialogController){
        this._connection = null;
        this._isConnecting = false;
    }

    set connection(connection: Connection) {
        this._connection = connection;
    }

    get connection() {
        return this._connection;
    }

    public connect() {
        this._isConnecting = true;
        setTimeout(() => {
            this._dialogController.ok(this.connection).then(() => {
                this._isConnecting = false;
            });
        },5000);
    }

    public get isConnecting() {
        return this._isConnecting;
    }
}

