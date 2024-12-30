export const localStorageService = {
  // Методы для работы с файлами
  saveFile(fileData) {
    const files = this.getFiles();
    files.push(fileData);
    localStorage.setItem("files", JSON.stringify(files));
    return fileData;
  },

  getFiles() {
    return JSON.parse(localStorage.getItem("files")) || [];
  },

  getFile(fileId) {
    const files = this.getFiles();
    return files.find((file) => file.id === fileId);
  },

  deleteFile(fileId) {
    const files = this.getFiles();
    const updatedFiles = files.filter((file) => file.id !== fileId);
    localStorage.setItem("files", JSON.stringify(updatedFiles));
  },

  // Вспомогательные методы для работы с файлами
  async uploadFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = {
          id: "file-" + Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
          uploadDate: new Date().toISOString(),
        };

        const savedFile = this.saveFile(fileData);
        resolve(savedFile);
      };
      reader.readAsDataURL(file);
    });
  },
};
