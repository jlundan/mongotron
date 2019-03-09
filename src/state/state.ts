import {Config} from "./config";
import {DBNavigatorViewState} from "./connections";

export interface State {
    config: Config;
    viewStates: {
        dbNavigator: DBNavigatorViewState
    };
}
