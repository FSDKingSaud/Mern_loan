const axios = require("axios");

class NIBSSClient {
  constructor(config = {}) {
    this.endpoint = process.env.NIBSS_BASE_URL; // Base URL for the NIBSS API
    this.apiKey = process.env.NIBSS_DD_API_KEY;   // API key
    this.clientId = process.env.NIBSS_DD_CLIENT_ID; // Client ID
    this.clientSecret = process.env.NIBSS_DD_CLIENT_SECRET; // Client Secret
    this.token = ""; // Authorization token

    this.client = axios.create({
      baseURL: this.endpoint,
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "apikey": this.apiKey,
      },
    });
  }

  // Set Authorization token
  setToken(token) {
    this.token = token;
    this.client.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  // Create a mandate
  async createMandateDirectDebit(data) {
    return this.sendRequest("POST", "/ndd/v2/api/MandateRequest/CreateMandateDirectDebit", {
      "Content-Type": "multipart/form-data",
      data: data,
    });
  }

  // Reset the token when expired
  async reset() {
    const payload = {
      client_Id: this.clientId,
      scope: `${this.clientId}/.default`,
      grant_type: "client_credentials",
      client_secret: this.clientSecret,
    };

    const response = await this.sendRequest("POST", "/v2/reset", {
      "Content-Type": "application/x-www-form-urlencoded",
      data: payload,
    });

    if (response?.access_token) {
      this.setToken(response.access_token); // Update token
    }

    return response;
  }

  // Centralized request handler
  async sendRequest(method, uri, options) {
    try {
      const requestOptions = this.createRequestOptions(options["Content-Type"], options["data"]);
      const response = await this.client.request({
        method: method,
        url: uri,
        ...requestOptions,
      });

      return this.prepareResponse(response.data);
    } catch (error) {
      // Handle 403 token expiry
      if (error.response?.status === 403) {
        await this.reset(); // Reset token
        return this.sendRequest(method, uri, options); // Retry request
      }

      throw error;
    }
  }

  // Prepare JSON response
  prepareResponse(response) {
    return response;
  }

  // Request options based on content type
  createRequestOptions(contentType, data) {
    switch (contentType) {
      case "application/json":
        return { headers: { "Content-Type": contentType }, data };
      case "application/x-www-form-urlencoded":
        return { headers: { "Content-Type": contentType }, data: new URLSearchParams(data) };
      case "multipart/form-data":
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        return { headers: { "Content-Type": contentType }, data: formData };
      default:
        return { headers: { "Content-Type": contentType }, data };
    }
  }
}

module.exports = NIBSSClient;
