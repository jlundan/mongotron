import {State} from "../state/state";
import {bootstrap} from "aurelia-bootstrapper";
import {Aurelia, PLATFORM} from "aurelia-framework";
import environment from "../environment";
import {App} from "../app";

import {BootstrapDialogRenderer} from '../extensions/aurelia-bootstrap-dialog/bootstrap-dialog-renderer';

export class AureliaInitializer {
    public static bootstrap(initialState: State) {
        bootstrap(async (aurelia: Aurelia) => {
            await aurelia.use.standardConfiguration();

            if (environment.debug) {
                aurelia.use.developmentLogging();
            }
            aurelia.use.globalResources(PLATFORM.moduleName('extensions/aurelia-bootstrap-dialog/bootstrap-dialog.html'));

            aurelia.use.plugin(PLATFORM.moduleName('aurelia-dialog'), (config) => {
                config.useRenderer(BootstrapDialogRenderer);
            });

            aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), {initialState});

            await aurelia.start();
            return aurelia.setRoot(App, document.body);
        });
    }
}
