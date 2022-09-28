import axios from "@/service/http/request"

export const test = (data) => {
    return axios({
        url: 'api/test/',
        method: 'GET',
        data,
    })
}
