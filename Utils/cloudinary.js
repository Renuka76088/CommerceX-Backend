import cloudinary from "../Config/cloudinary.js";

// Single file upload
export const uploadToCloudinary = async (filePath, folder = "mediscript") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // auto detect (image, pdf, video)
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};

// Delete file
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    throw new Error("Cloudinary delete failed: " + err.message);
  }
};
