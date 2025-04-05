import { deleteImageFromCloudinary, imageUploadToCloudinary } from "../helpers/image.upload.js";
import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';


export const createCaseStudy = async (req, res) => {    
    const { title, subTitle, description, author } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided', success: false });
    }

    if (!title || !description ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {

        const folderPath = 'vsg/casestudy';
        const result = await imageUploadToCloudinary(req.file, folderPath);
        const blog = await prisma.caseStudy.create({
            data: {
                id: uuidv4(),
                title,
                subTitle,
                author,
                image: result.secure_url,
                 description
            }
        });

        return res.status(201).json({
            success: true,
            message: "Case Study created successfully",
            data: blog
        });

    } catch (error) {
        console.error("Error creating casestudy:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the casestudy"
        });
    }
};

export const getAllCasestudies = async (req, res) => {
    try {
        const caseStudies = await prisma.caseStudy.findMany({
            orderBy: {
                createdAt: 'desc'  
            }
        });

        return res.status(200).json({
            success: true,
            message: "Case Study fetched successfully",
            data: caseStudies
        });

    } catch (error) {
        console.error("Error fetching casestudy:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching casestudy"
        });
    }
};

export const getcaseId = async (req, res) => {
    const { id } = req.params;
    try {
        const cases = await prisma.caseStudy.findUnique({
            where: { id },
          
        });

        if (!cases) {
            return res.status(404).json({
                success: false,
                message: "Case Study not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Case Study fetched successfully",
            data: cases
        });

    } catch (error) {
        console.error("Error fetching case:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the case"
        });
    }
}

export const updateCasestudy = async (req, res) => {
    const { id } = req.params;
    const {title,subTitle,description,author}= req.body;
    // Validate required fields
    if (!title||!description) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }


    try {
        // Check if blog exists
        const existingCasestudy = await prisma.caseStudy.findUnique({
            where: { id }
        });

        if (!existingCasestudy) {
            return res.status(404).json({
                success: false,
                message: "Case Study not found"
            });
        }
        
        const new_data ={title,subTitle,description,author}
        // If there's a new file uploaded
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (existingCasestudy.image) {
                const publicId = existingCasestudy.image.split('/').slice(7, -1).join('/') + '/' + existingCasestudy.image.split('/').pop().split('.')[0];
                await deleteImageFromCloudinary(publicId);  // Delete the image from Cloudinary
            }

            // Upload the new image
            const folderPath = 'vsg/casestudy';
            const result = await imageUploadToCloudinary(req.file, folderPath);

            new_data.image = result.secure_url;  // Update the image URL in the data to be saved
        }

        // Update blog
        const updatedCaseStudy = await prisma.caseStudy.update({
            where: { id },
            data: {
                ...new_data,
                updatedAt: new Date()  // Automatically set the updated timestamp
            }
        });

        return res.status(200).json({
            success: true,
            message: "Case Study updated successfully",
            
        });

    } catch (error) {
        console.error("Error updating casestudy:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the casestudy"
        });
    }
};

export const deleteCaseStudy= async (req, res) => {
    const { id } = req.params;    
    try {
        // Check if blog exists
        const existingCasestudy = await prisma.caseStudy.findUnique({
            where: { id }
        });

        if (!existingCasestudy) {
            return res.status(404).json({
                success: false,
                message: "Casestudy not found"
            });
        }
        const publicId = existingCasestudy.image.split('/').slice(7, -1).join('/') + '/' + existingCasestudy.image.split('/').pop().split('.')[0];
        await deleteImageFromCloudinary(publicId);

        // Delete blog
        await prisma.caseStudy.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Case Study deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting casestudy:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the casestudy"
        });
    }
};


