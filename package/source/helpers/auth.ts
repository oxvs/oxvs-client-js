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
namespace auth {
    /**
     * @func auth.login
     * @description Authenticate with the host server
     * 
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.password - The password of the user
     * @returns {Promise} Promise returning either the response, or an error
     */
    export const login = (props: { ouid: string, password: string }): any => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: 'auth/login',
            authorization: { ouid: "!unknown", token: "?" },
            body: {
                ouid: props.ouid,
                password: props.password
            }
        })
    }

    /**
     * @func auth.logout
     * @description Logout of the host server
     * 
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.token - The token of the user
     * @returns {Promise} Promise returning either the response, or an error
     */
    export const logout = (props: { ouid: string, token: string }): any => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: 'auth/logout',
            authorization: props,
            body: {}
        })
    }

    /**
     * @func auth.register
     * @description Register a new user with the host server
     * 
     * @param {object} props - Object containing information about the request
     * @param {string} props.ouid - The ouid of the user
     * @param {string} props.password - The password of the user
     * @returns {Promise} Promise returning either the response, or an error
     */
    export const register = (props: { ouid: string, password: string }): any => {
        return fetchHandler.send({
            method: 'POST',
            hostServerUrl: oxvscs.hostServer,
            location: 'auth/new',
            authorization: { ouid: "!unknown", token: "?" },
            body: {
                ouid: props.ouid,
                password: props.password
            }
        })
    }
}