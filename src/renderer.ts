/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/styles/style.scss';
import '../static/styles/main.scss';

import {AureliaInitializer} from "./initializers/aurelia-initializer";
import {AppInitializer} from "./initializers/app-initializer";
import {State} from "./state/state";

import * as Bluebird from 'bluebird';

Bluebird.config({warnings: {wForgottenReturn: false}});

export class Renderer {
    public static render() {
        AppInitializer.bootstrap().then((initialState: State) => {
            AureliaInitializer.bootstrap(initialState);
        });
    }
}

Renderer.render();
