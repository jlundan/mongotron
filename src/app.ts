import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Robomongo';
    config.map([
      { route: ['connections', ''],   name: 'main', moduleId: PLATFORM.moduleName('./modules/connections/connections'), nav: true, title: 'Connections' },
      { route: ['settings'],          name: 'main', moduleId: PLATFORM.moduleName('./modules/settings/settings'), nav: true, title: 'Settings' },
    ]);

    this.router = router;
  }
}
