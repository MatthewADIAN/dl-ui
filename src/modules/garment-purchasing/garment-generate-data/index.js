export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'Export Data  Garment' } 
        ]);

        this.router = router;
    }
}
