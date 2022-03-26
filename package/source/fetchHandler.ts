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
namespace fetchHandler {
    /**
     * @typedef {Object} authorization
     * @property {string} ouid - The ouid of the user sending the request
     * @property {string} token - The token of the user sending the request
     * @description The authorization object for an HTTP request
     */
    export type authorization = { ouid: string, token: string }

    /**
     * @typedef {Object} basicRequest
     * @property {string} hostServerUrl - The URL of the user's host server
     * @property {string} location - Location of the resource relative to the host server
     * @property {authorization} authorization - The authorization object for the request
     * @property {any} body - The body of the request
     * @description The authorization object for an HTTP request
     */
    export type basicRequest = { method: string, hostServerUrl: string, location: string, authorization: authorization, body?: any }

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
    export const send = (props: basicRequest): any => {
        return new Promise((resolve, reject) => {
            let data: any = {
                method: props.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': props.authorization.ouid + '(::AT::)' + props.authorization.token
                }
            }

            if (props.method !== 'GET') { data.body = JSON.stringify(props.body) }

            fetch(`${props.hostServerUrl}/api/v1/${props.location}`, data).then((response) => response.json()).then((data) => {
                resolve(data) // resolve promise with returned data
            }).catch((err) => {
                reject(err) // reject promise with error message
            })
        })
    }
}