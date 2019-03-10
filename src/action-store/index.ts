import {pluck, distinctUntilChanged} from "rxjs/operators"
import {autoinject} from "aurelia-dependency-injection";
import {Store} from "aurelia-store";
import {State} from "../state/state";

@autoinject()
export class ActionStore {
    private readonly _isAutoRegistering: boolean;

    constructor(private _store: Store<State>) {
        this._isAutoRegistering = true;
    }

    public register(action: Action) {
        console.log(`ActionStore: Registering class ${action.name}`);
        this._store.registerAction(action.name, action.reducer)
    }

    public fire(action: Action): Promise<void> {
        return new Promise((resolve, reject) => {
            try{
                if(this._isAutoRegistering === true && !this._store.isActionRegistered(action.name)) {
                    this.register(action);
                }
                resolve();
            }catch (e) {
                reject(new Error(e));
            }
        }).then(() => {
            return this._store.dispatch(action.name, action.payload);
        });
    }
}

export abstract class Action {
    protected constructor(private _name: string, private _payload: any) {}

    public get name() {
        return this._name;
    }

    public get payload() {
        return this._payload;
    }

    public get reducer(): (state: State, payload: any) => State | Promise<State> {
        return (state: State): null | Promise<null> => {
            const newState = JSON.parse(JSON.stringify(state));
            const result = this.updateState(newState, this._payload);
            if(result instanceof Promise) {
                return result.then(() => {
                    return newState;
                });
            }
            return newState;
        };
    }

    protected abstract updateState(state: State, payload: any): void | Promise<void>;
}

export function filter(subState) {
    const subStates = subState.split('.');
    return {
        selector: (store) => store.state.pipe(pluck(...subStates), distinctUntilChanged()),
        target: 'state',
        onChanged: 'changeHandler'
    }
}
