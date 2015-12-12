Package.describe({
  name: 'q42:microsoft',
  version: '0.1.0',
  summary: 'An implementation of the Microsoft OAuth flow.',
  git: 'https://github.com/Q42/meteor-microsoft',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('dburles:eslint');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);

  api.export('Microsoft');

  api.addFiles(
      ['configure.html', 'configure.js'],
      'client');

  api.addFiles('server/server.js', 'server');
  api.addFiles('client/client.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ecmascript');
  api.use('q42:microsoft');

  // Tests will follow soon!
  api.addFiles([
    'test/client/dutchman.test.js'
  ]);
});
