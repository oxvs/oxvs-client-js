"use strict";
/**
 * @file Handle HTTP requests
 * @name fetchHandler.ts
 * @author oxvs <admin@oxvs.net>
 * @version 0.0.1
 */
/**
 * @namespace fetchHandler
 * @description Handle HTTP requests
 */
var fetchHandler;
(function (fetchHandler) {
    /**
     * @func fetchHandler.send
     * @description Send HTTP request to a host server
     *
     * @param {basicRequest} props Object containing all required information
     * @param {string} props.hostServerUrl URL of the host server
     * @param {string} props.location Location of the resource relative to the host server
     * @param {authorization} props.authorization Object containing the ouid and token
     * @param {any} props.body Body of the request
     * @returns {Promise} Promise returning either the response, or an error
     */
    fetchHandler.send = (props) => {
        return new Promise((resolve, reject) => {
            let data = {
                method: props.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': props.authorization.ouid + '(::AT::)' + props.authorization.token
                }
            };
            if (props.method !== 'GET') {
                data.body = JSON.stringify(props.body);
            }
            fetch(`${props.hostServerUrl}/api/v1/${props.location}`, data).then((response) => response.json()).then((data) => {
                resolve(data); // resolve promise with returned data
            }).catch((err) => {
                reject(err); // reject promise with error message
            });
        });
    };
})(fetchHandler || (fetchHandler = {}));
/**
 * @file Handle authentication requests and storage client-side
 * @name auth.ts
 * @author oxvs <admin@oxvs.net>
 * @version 0.0.1
 */
/// <reference path="../fetchHandler.ts" />
/**
 * @namespace auth
 * @description Handle authentication requests and storage client-side
 */
var auth;
(function (auth) {
    /**
     * @func auth.login
     * @description Authenticate with the host server
     *
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.password - The password of the user
     * @returns {Promise} Promise returning either the response, or an error
     */
    auth.login = (props) => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: 'auth/login',
            authorization: { ouid: "!unknown", token: "?" },
            body: {
                ouid: props.ouid,
                password: props.password
            }
        });
    };
    /**
     * @func auth.logout
     * @description Logout of the host server
     *
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.token - The token of the user
     * @returns {Promise} Promise returning either the response, or an error
     */
    auth.logout = (props) => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: 'auth/logout',
            authorization: props,
            body: {}
        });
    };
    /**
     * @func auth.register
     * @description Register a new user with the host server
     *
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.password - The password of the user
     * @returns {Promise} Promise returning either the response, or an error
     */
    auth.register = (props) => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: 'auth/new',
            authorization: { ouid: "!unknown", token: "?" },
            body: {
                ouid: props.ouid,
                password: props.password
            }
        });
    };
})(auth || (auth = {}));
/**
 * @file Handle storage requests client-side
 * @name storage.ts
 * @author oxvs <admin@oxvs.net>
 * @version 0.0.1
 */
/// <reference path="../fetchHandler.ts" />
/**
 * @namespace storage
 * @description Handle storage requests client-side
 */
var storage;
(function (storage) {
    /**
     * @func storage.get
     * @description Get data from the host server
     *
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.token - The token of the user
     * @param {string} props.id - The resource id to get
     * @returns {Promise} Promise returning either the response, or an error
     */
    storage.get = (props) => {
        return fetchHandler.send({
            method: 'GET',
            hostServerUrl: oxvscs.hostServer,
            location: `bucket/get/${props.id}`,
            authorization: { ouid: props.ouid, token: props.token },
        });
    };
    /**
     * @func storage.upload
     * @description Upload data to the host server
     *
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.token - The token of the user
     *
     * @param {object} props.info - Information about the upload
     * @param {string} props.info.data - The data to upload
     * @param {array} props.info.shareList - The ouid of users that will have access to the object
     * @param {boolean} props.info.encrypted - Whether the data is encrypted
     *
     * @returns {Promise} Promise returning either the response, or an error
     */
    storage.upload = (props) => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: `bucket/upload`,
            authorization: { ouid: props.ouid, token: props.token },
            body: {
                data: {
                    __data: props.info.data,
                },
                shareList: props.info.shareList,
                encrypted: props.info.encrypted,
            }
        });
    };
    /**
     * @func storage.remove
     * @description Delete data from the host server
     *
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string } props.token - The token of the user
     * @param {string} props.id - The resource id to delete
     * @param {string} props.requestFrom - The ouid of the user requesting the deletion
     * @returns {Promise} Promise returning either the response, or an error
     */
    storage.remove = (props) => {
        return fetchHandler.send({
            method: 'DELETE',
            hostServerUrl: oxvscs.hostServer,
            location: `bucket/${props.id}/delete`,
            authorization: { ouid: props.ouid, token: props.token },
            body: {
                requestFrom: props.requestFrom,
            }
        });
    };
})(storage || (storage = {}));
/// <reference path="fetchHandler.ts" />
/// <reference path="helpers/auth.ts" />
/// <reference path="helpers/storage.ts" />
/*
 * TODO:
 * - Enable state syncing
 * - Enable user control over their active tokens
 */
/**
 * @global
 * @name oxvscs
 * @description Contains information and methods for using the OXVS Client SDK
 */
let oxvscs = {
    /**
     * @global
     * @name hostServer
     * @description The URL of the host server
     * @default https://api.oxvs.net
     * @type {string}
     * @example
     * oxvscs.hostServer = 'https://api.oxvs.net'
     */
    hostServer: 'https://api.oxvs.net',
    /**
     * @class
     * @name oxvscs.auth
     * @description Contains methods for authenticating with the host server
     * @example
     * oxvscs.auth.login({ ouid: 'username', password: 'password' })
     */
    auth: {
        /**
         * @func
         * @name oxvscs.auth.login
         * @description Authenticate with the host server
         * @param {object} props Object containing the ouid and password
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.password The password of the user
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.auth.login({ ouid: 'username', password: 'password' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        login: (props) => {
            // login and then update localStorage.oxvsUser
            return new Promise((resolve, reject) => {
                auth.login(props)
                    .then((response) => {
                    window.localStorage.setItem("oxvsUser", JSON.stringify({
                        ouid: props.ouid,
                        token: response.token
                    }));
                    resolve(response);
                }).catch((err) => reject(err));
            });
        },
        /**
         * @func
         * @name oxvscs.auth.logout
         * @description Logout of the host server
         * @param {object} props Object containing the ouid and token
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.token The token of the user
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.auth.logout({ ouid: 'username', token: 'token' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        logout: auth.logout,
        /**
         * @func
         * @name oxvscs.auth.register
         * @description Register a new user with the host server
         * @param {object} props Object containing the ouid and password
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.password The password of the user
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.auth.register({ ouid: 'username', password: 'password' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        register: (props) => {
            return new Promise((resolve, reject) => {
                auth.register(props)
                    .then(() => {
                    // register by default doesn't return a token, so we need to login to get one
                    oxvscs.auth.login(props)
                        .then((response) => {
                        resolve(response);
                    }).catch((err) => reject(err));
                }).catch((err) => reject(err));
            });
        }
    },
    /**
     * @class
     * @name oxvscs.storage
     * @description Contains methods for storing data on the host server
     * @example
     * oxvscs.storage.get({ ouid: 'username', token: 'token' })
     */
    storage: {
        /**
         * @func
         * @name oxvscs.storage.get
         * @description Get data from the host server
         * @param {object} props Object containing the ouid and token
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.token The token of the user
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.storage.get({ ouid: 'username', token: 'token' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        get: storage.get,
        /**
         * @func
         * @name oxvscs.storage.upload
         * @description Set data on the host server
         * @param {object} props Object containing the ouid and token
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.token The token of the user
         * @param {object} props.data The data to be set
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.storage.upload({
         *    ouid: 'username',
         *    token: 'token',
         *    info: {
         *        data: {
         *            { type: "o.encrypted", value: "Hello, world!" }
         *        },
         *        encrypted: true,
         *        shareList: [
         *            { type: "o.encrypted", value: "@user:test!o.host[server.oxvs.net]" },
         *            { type: "o.encrypted", value: "@user:test1!o.host[server.oxvs.net]" }
         *        ]
         *    }
         * })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        upload: storage.upload,
        /**
         * @func
         * @name oxvscs.storage.remove
         * @description Remove data from the host server
         * @param {object} props Object containing the ouid and token
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.token The token of the user
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.storage.remove({ ouid: 'username', token: 'token' })
         * .then((response) => {
         *   console.log(response)
         * })
         * .catch((err) => {
         *  console.log(err)
         * })
         */
        remove: storage.remove
    }
};
