import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadImage = async (path , folder) => {
    try {
        const data = await cloudinary.v2.uploader.upload(path, {
            folder
        });
        return { url: data.url, public_id: data.public_id };
    } catch (error) {
        console.log(result,error)
    }
}
const deleteImage = async (public_id) => {
    await cloudinary.v2.uploader.destroy(public_id, (error, result) => {
        console.log(result,error)
    })
}

export {
    deleteImage,
    uploadImage,
}