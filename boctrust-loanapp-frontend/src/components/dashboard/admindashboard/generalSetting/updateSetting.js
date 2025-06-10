import apiClient from "../../../../lib/axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

const updateSettings = async (updatedSettings, type) => {
  try {
    const { data } = await apiClient.put(`/settings/settings/${type}`, updatedSettings);

 
    return data;
  } catch (error) {
    console.error("Error updating settings:", error.message);
    throw error;
  }
};

export default updateSettings;

// Usage example:
// const updatedSettings = {
//     siteTitle: 'Updated Site Title',
//     address: 'Updated Address',
//     // Include other updated properties as needed
// };

// updateSettings(updatedSettings)
//     .then(data => console.log('Settings updated:', data))
//     .catch(error => console.error('Failed to update settings:', error));
