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
     * oxvscs.auth.login({ ouid: '@user:test!o.host[server.oxvs.net]', password: 'password' })
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
         * oxvscs.auth.login({ ouid: '@user:test!o.host[server.oxvs.net]', password: 'password' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        login: (props: { ouid: string, password: string }) => {
            // login and then update localStorage.oxvsUser
            return new Promise((resolve, reject) => {
                auth.login(props)
                    .then((response: any) => {
                        window.localStorage.setItem("oxvsUser", JSON.stringify({
                            ouid: props.ouid,
                            token: response.token
                        }))

                        resolve(response)
                    }).catch((err: any) => reject(err))
            })
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
         * oxvscs.auth.logout({ ouid: '@user:test!o.host[server.oxvs.net]', token: 'token' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        logout: (props: { ouid: string, token: string }) => {
            return new Promise((resolve, reject) => {
                auth.logout(props)
                    .then(() => {
                        window.localStorage.removeItem("oxvsUser")
                        resolve(true)
                    })
                    .catch((err: any) => reject(err))
            })
        },

        /**
         * @func
         * @name oxvscs.auth.register
         * @description Register a new user with the host server
         * @param {object} props Object containing the ouid and password
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.password The password of the user
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.auth.register({ ouid: '@user:test!o.host[server.oxvs.net]', password: 'password' })
         * .then((response) => {
         *    console.log(response)
         * })
         * .catch((err) => {
         *   console.log(err)
         * })
         */
        register: (props: { ouid: string, password: string }) => {
            return new Promise((resolve, reject) => {
                auth.register(props)
                    .then(() => {
                        // register by default doesn't return a token, so we need to login to get one
                        oxvscs.auth.login(props)
                            .then((response: any) => {
                                resolve(response)
                            }).catch((err: any) => reject(err))
                    }).catch((err: any) => reject(err))
            })
        }
    },
    /**
     * @class
     * @name oxvscs.storage
     * @description Contains methods for storing data on the host server
     * @example
     * oxvscs.storage.get({ ouid: '@user:test!o.host[server.oxvs.net]', token: 'token' })
     */
    storage: {
        /**
         * @func
         * @name oxvscs.storage.get
         * @description Get data from the host server
         * @param {object} props Object containing the ouid and token
         * @param {string} props.ouid The ouid of the user
         * @param {string} props.token The token of the user
         * @param {string} props.id The ID of the object to get
         * @returns {Promise} Promise returning either the response, or an error
         * @example
         * oxvscs.storage.get({ ouid: '@user:test!o.host[server.oxvs.net]', token: 'token', id: 'id-example' })
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
         *    ouid: '@user:test!o.host[server.oxvs.net]', 
         *    token: 'token',
         *    info: {
         *        data: {
         *            { type: "o.encrypted", value: "Hello, world!" }
         *        },
         *        encrypted: true,
         *        shareList: [
         *            { type: "o.encrypted", value: "@user:test1!o.host[server.oxvs.net]" },
         *            { type: "o.encrypted", value: "@user:test2!o.host[server.oxvs.net]" }
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
}