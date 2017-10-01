# angular-todo-list 

### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start this server is:

```bash
npm start
```

Now browse to the app at `http://localhost:8000`.

## Directory Layout

```
app/                                --> all of the source files for the application
  assets/                               --> other application files
    css/                                  --> custom styles
    data/                                 --> custom data
    fonts/                                --> custom fonts
    images/                               --> custom images
    js/                                   --> custom JavaScript files
    libs/                                 --> custom libraries
  bower_components/                     --> the angular framework files
  common/                               --> common application files
    constants/                              --> custom angular constants    
    directives/                             --> custom angular directives    
    filters/                                --> custom angular filters
  core/                                 --> main application files
    app.js                                  --> main application module
    app.routes.js                           --> main application routes
  index.html                            --> app layout file (the main html template file of the app)
build/                              --> minified JavaScript files
node_modules/                       --> the npm packages for the tools we need
coverage/                           --> coverage reports
dist/                               --> concatenated JavaScript files
protractor-test-results/            --> e2e tests results
tests/                              --> tests scenarios
  e2e/                                  --> end-to-end tests
  unit/                                 --> unit tests
unit-test-results/                  --> unit tests results
.bowerrc                            --> bower options file
.gitignore                          --> git ignore file
.jscsrc                             --> JSCS options file
.jshintrc                           --> JSHint options file
.travis.yml                         --> Travis CI config file
Gruntfile.js                        --> Grunt config file
Procfile                            --> define command which starts app
app.json                            --> web application details file
bower.json                          --> runtime dependencies of the project
karma.conf.js                       --> Karma config file (for unit tests)
package.json                        --> development dependencies of the project
protractor-conf.js                  --> Protractor config file (for e2e tests)
server.js                           --> server config file
```


## License

The MIT License, Copyright (c) 2017 Eri Jonhson
Based on [Michal Pietrzak Template](https://github.com/pamigomp/angularjs-template)
