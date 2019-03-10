import {pluck, distinctUntilChanged} from "rxjs/operators"
import {autoinject} from "aurelia-dependency-injection";
import {Store} from "aurelia-store";
import {State} from "../state/state";
import {Connection} from "../state/connections";

@autoinject()
export class ActionStore {
    constructor(private _store: Store<State>) {
        this.registerAddConnectionAction();
    }

    public registerAddConnectionAction(){
        this._store.registerAction('AddConnectionAction', (state: State, payload: any) => {
            const newConnections = JSON.parse(JSON.stringify(state.viewStates.dbNavigator.connections));
            newConnections.push(payload);
            state.viewStates.dbNavigator.connections = newConnections;
            return state;
        })
    }

    public fireAddConnectionAction(connection: Connection){
        return this._store.dispatch('AddConnectionAction', connection);
    }

}

export function filter(filters) {
    const result = {
        target: 'state',
        selector: {}
    };

    for(const key of Object.keys(filters)) {
        result.selector[key] = (store) => store.state.pipe(pluck(...(filters[key].split('.'))), distinctUntilChanged())
    }

    return result;
}
