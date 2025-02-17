import api from "@/utils/api";

export const profileService = {
  /**
   * Kullanıcı profilini getir
   */
  async getProfile() {
    const response = await api.get("/profile/me");
    return response.data;
  },

  /**
   * Kullanıcı profilini güncelle
   */
  async updateProfile(profileData: { name?: string; phone?: string; bio?: string }) {
    const response = await api.put("/profile/update", profileData);
    return response.data;
  },

  /**
   * Kullanıcı şifresini değiştir
   */
  async changePassword(oldPassword: string, newPassword: string) {
    const response = await api.put("/profile/change-password", { oldPassword, newPassword });
    return response.data;
  },

  /**
   * Profil fotoğrafını yükle
   */
  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await api.post("/profile/upload-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};
