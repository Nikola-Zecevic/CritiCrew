// Secure Cloudinary service using environment variables
// Create a .env file in your frontend root with:
// VITE_CLOUDINARY_CLOUD_NAME=criticrew
// VITE_CLOUDINARY_API_KEY=your_api_key_here
// VITE_CLOUDINARY_UPLOAD_PRESET=criticrew

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'criticrew';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'criticrew';

const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY); // Add API key for authentication
    formData.append('folder', 'movies'); // Organize uploads in movies folder

    try {
        console.log('🔄 Uploading to Cloudinary...', {
            url: CLOUDINARY_URL,
            preset: UPLOAD_PRESET,
            fileType: file.type,
            fileSize: file.size
        });
        
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary error response:', errorData);
            
            // Check for common errors
            if (errorData.error?.message?.includes('preset')) {
                throw new Error('Upload preset error: Make sure your preset "criticrew" is set to UNSIGNED mode in Cloudinary dashboard');
            }
            
            throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            url: data.secure_url,
            public_id: data.public_id,
            width: data.width,
            height: data.height,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        
        // Check for network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to Cloudinary. Check your internet connection.');
        }
        
        // Check for CORS errors
        if (error.message.includes('CORS')) {
            throw new Error('CORS error: Make sure your Cloudinary preset is set to UNSIGNED mode.');
        }
        
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

// Export both named and default for flexibility
export { uploadToCloudinary };
export default { uploadToCloudinary };