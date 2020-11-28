import axios from "axios"

const request = axios.create({baseURL:'http://conduit.productionready.io'});

export default request