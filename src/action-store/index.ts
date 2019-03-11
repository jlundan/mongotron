import {pluck, distinctUntilChanged} from "rxjs/operators"
import {autoinject} from "aurelia-dependency-injection";
import {connectTo, Store} from "aurelia-store";
import {State} from "../state/state";
import {Connection} from "../state/connections";
import produce from "immer"

@autoinject()
export class ActionStore {
    constructor(private _store: Store<State>) {
        this.registerAddConnection();
    }

    public registerAddConnection(){
        this._store.registerAction('AddConnection', (state: State, connection: Connection) => {
            return produce(state, (draftState) => {
                draftState.viewStates.dbNavigator.connections.push(connection);
            })
        });
    }

    public fireAddConnection(connection: Connection){
        return this._store.dispatch('AddConnection', connection);
    }

}

export function connectToState(filters?: any): ClassDecorator {
    const result = {
        selector: {}
    };

    for(const key of Object.keys(filters)) {
        result.selector[key] = (store) => store.state.pipe(pluck(...(filters[key].split('.'))), distinctUntilChanged())
    }

    return connectTo(result);
}
