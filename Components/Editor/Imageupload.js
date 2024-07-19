
export default class ImageUploadAdapter {
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    async upload() {
        const data = new FormData();
        data.append('file', await this.loader.file);

        try {
            const response = await ImageUploadApi.upload(data);
            console.log(response);
            return { default: response.data.data.file_path };
        } catch (error) {
            console.error('Image upload failed:', error);
            return { default: '' };
        }
    }

    // Aborts the upload process.
    abort() {
        // Implement if needed
    }
}
