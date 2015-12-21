# Microsoft meteor package
__An implementation of the Microsoft OAuth flow__

[![Build Status][travis-image]][travis-url]

## Getting started

Add the package to meteor
```
meteor add q42:microsoft
```

## Basic usage

The usage is pretty much the same as all other OAuth flow implementations for meteor. It's inspired by the official Google meteor package.
Basically you can use:

```javascript
var callback = Accounts.oauth.credentialRequestCompleteHandler(callback);
Microsoft.requestCredential(options, callback);
```

For examples and more information on what options you can use, check out: [q42:accounts-microsoft](https://github.com/Q42/meteor-accounts-microsoft).

## References

### Accounts package

* [q42:accounts-microsoft](https://github.com/Q42/meteor-accounts-microsoft)

### Microsoft REST documentation

* [REST Reference](https://msdn.microsoft.com/en-us/library/hh243648.aspx)
* [Signing users in](https://msdn.microsoft.com/en-us/library/office/dn659750.aspx)
* [Getting user data](https://msdn.microsoft.com/en-us/library/office/dn659736.aspx)

[travis-url]: https://travis-ci.org/Q42/meteor-microsoft
[travis-image]: http://img.shields.io/travis/Q42/meteor-microsoft.svg