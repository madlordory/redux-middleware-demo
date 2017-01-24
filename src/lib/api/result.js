/**
 * Mocking client-server processing
 */
import Req from 'reqwest';
import mockData from './mock-data';
// import Promise from 'Promise';
const TIMEOUT = 2000;
const MOCK_MODE = true;
const mockDataCreator = (data, timeout)=> {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            resolve(data);
        }, timeout || TIMEOUT)
    })
}

const api = {
    getInitData: (token, ownerId) => {
        "use strict";
        if (MOCK_MODE) {
            return mockDataCreator(mockData.guide.GET_INIT_DATA, TIMEOUT);
        } else {
            return Req({
                url: 'path/to/html' + token && ('?token=' + token) || ''
                , method: 'post'
                , data: {ownerId: ownerId, baz: 100}
            });

        }
    },
};
export default api;
