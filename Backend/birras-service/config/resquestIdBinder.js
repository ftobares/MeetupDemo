const uuidv4 = require('uuid/v4')
const cls = require('cls-hooked');
const props = require('@config/properties')

module.exports = ns => {
    if (!ns) throw new Error('CLS namespace required');

    return function clsifyMiddleware(req, res, next) {
        ns.bindEmitter(req);
        ns.bindEmitter(res);

        ns.run(() => {
            const requestId = uuidv4();
            cls.getNamespace(props.appName).set('requestId', requestId);
            next();
        });
    };
};