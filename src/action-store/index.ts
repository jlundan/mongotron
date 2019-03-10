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

    public register(clazz) {
        const instance = new Creator<Action>(clazz).getNew();

        if(!(instance instanceof Action)) {
            throw `ActionStore: Cannot fire class ${clazz.name} which is not Action`;
        }

        console.log(`ActionStore: Registering class ${clazz.name}`);

        this._store.registerAction(clazz.name, instance.reducer)
    }

    public fire(clazz, payload: any): Promise<void> {
        return new Promise((resolve, reject) => {
            try{
                if(this._isAutoRegistering === true && !this._store.isActionRegistered(clazz.name)) {
                    this.register(clazz);
                }
                resolve();
            }catch (e) {
                reject(new Error(e));
            }
        }).then(() => {
            return this._store.dispatch(clazz.name, payload);
        });
    }
}

export abstract class Action {
    public get reducer() {
        return (state: State, payload: any): State => {
            const newState = JSON.parse(JSON.stringify(state));
            return this.perform(newState, payload);
        };
    }

    protected abstract perform(state: State, any): State;

}

interface ParameterlessConstructor<T> {
    new(): T;
}

class Creator<T> {
    constructor(private ctor: ParameterlessConstructor<T>) {}
    getNew() {
        return new this.ctor();
    }
}

export function filter(subState) {
    const subStates = subState.split('.');
    return {
        selector: (store) => store.state.pipe(pluck(...subStates), distinctUntilChanged()),
        target: 'state',
        onChanged: 'changeHandler'
    }
}
