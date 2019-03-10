import {State} from "./state";
import {Connection} from "./connections";
import {Action} from "../action-store";

export class AddConnectionAction extends Action {
    constructor(private connection: Connection){
        super ("ACTION_ADD_CONNECTION", connection);
    }

    public updateState(state: State, connection: Connection) {
        state.viewStates.dbNavigator.connections.push(connection);
    }
}
