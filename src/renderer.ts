/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/styles/style.scss';

import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia } from 'aurelia-framework';
import { App } from './app';
import environment from './environment';
import * as Bluebird from 'bluebird';

Bluebird.config({ warnings: { wForgottenReturn: false } });

bootstrap(async (aurelia: Aurelia) => {
  aurelia.use.standardConfiguration();

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  await aurelia.start();
  return aurelia.setRoot(App, document.body);
});
