const axios = require('axios');

class FiveMAPI {
    constructor(serverIP) {
        this.db = new Map()
        
        if (serverIP.includes(":")) {
            this.serverIP = serverIP
            console.log('Connected to server:', this.serverIP);
        } else {
            this.cfxre(serverIP);
        }
    }

    async cfxre(url) {
        let request;
        if (url.startsWith("cfx.re/join/")) {
            request = "https://" + url;
        } else if (url.startsWith("https://cfx.re/join/")) {
            request = url;
        } else {
            request = "https://cfx.re/join/" + url;
        }

        try {
            this.serverIP = (await axios.get(request)).headers["x-citizenfx-url"].replace("http://", "").replace("/", "");
            console.log('Connected to server :', this.serverIP);
        } catch (error) {
            return null
        }
    }

    async getServerInfo() {
        try {
            const response = await axios.get(`http://${this.serverIP}/info.json`);
            this.db.set(`http://${this.serverIP}/info.json`, response.data)
            return response.data;
        } catch (error) {
            const cachedData = this.db.get(`http://${this.serverIP}/info.json`)
            if (cachedData) return cachedData
            return null;
        }
    }

    async getDynamicInfo() {
        try {
            const response = await axios.get(`http://${this.serverIP}/dynamic.json`);
            this.db.set(`http://${this.serverIP}/dynamic.json`, response.data)
            return response.data;
        } catch (error) {
            const cachedData = this.db.get(`http://${this.serverIP}/dynamic.json`)
            if (cachedData) return cachedData
            return null;
        }
    }

    async getPlayers() {
        try {
            const response = await axios.get(`http://${this.serverIP}/players.json`);
            this.db.set(`http://${this.serverIP}/players.json`, response.data)
            return response.data;
        } catch (error) {
            const cachedData = this.db.get(`http://${this.serverIP}/players.json`)
            if (cachedData) return cachedData
            return null;
        }
    }

    async getServerStatus() {
        try {
            await axios.get(`http://${this.serverIP}/info.json`);
            return true;
        } catch (error) {
            return false;
        }
    }

}

module.exports = FiveMAPI;
