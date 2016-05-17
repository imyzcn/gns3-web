export class App {
  configureRouter(config, router){
    config.title = 'GNS3';
    config.map([
      { route: ['','welcome'],  name: 'welcome',  moduleId: './welcome',  nav: true, title:'Welcome' },
      { route: 'computes',      name: 'computes', moduleId: './computes', nav: true, title:'Computes' },
      { route: 'projects',      name: 'projects', moduleId: './projects', nav: true, title:'Projects' },
      { route: 'compute',       name: 'compute',  moduleId: './compute' },
      { route: 'project',       name: 'project',  moduleId: './project' },
      { route: 'node',          name: 'node',     moduleId: './node' }
    ]);

    this.router = router;
  }
}
