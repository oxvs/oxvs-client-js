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

namespace storage {
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
    export const get = (props: { ouid: string, token: string, id: string }): any => {
        return fetchHandler.send({
            method: 'GET',
            hostServerUrl: oxvscs.hostServer,
            location: `bucket/get/${props.id}`,
            authorization: { ouid: props.ouid, token: props.token },
        })
    }

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
    export const upload = (props: { ouid: string, token: string, info: any }): any => {
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
        })
    }

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
    export const remove = (props: { ouid: string, token: string, id: string, requestFrom: string }): any => {
        return fetchHandler.send({
            method: 'DELETE',
            hostServerUrl: oxvscs.hostServer,
            location: `bucket/${props.id}/delete`,
            authorization: { ouid: props.ouid, token: props.token },
            body: {
                requestFrom: props.requestFrom,
            }
        })
    }
}