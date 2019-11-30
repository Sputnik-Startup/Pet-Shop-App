const axios = require("axios");

const api = axios.create({
    baseURL: "http://localhost:4041"
});

module.exports = api;