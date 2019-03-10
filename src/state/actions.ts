import {State} from "./state";
import {Connection} from "./connections";
import {Action} from "../action-store";

export class AddConnectionAction extends Action {
    protected perform(state: State, connection: Connection): State {
        state.viewStates.dbNavigator.connections.push(connection);
        return state;
    }
}
