import { deleteImageFromCloudinary, imageUploadToCloudinary } from "../helpers/image.upload.js";
import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';


export const createCareer = async (req, res) => {    
    const { position, positionCount, location, shortdescription,jobType } = req.body;    
    if (!position || !positionCount||!location||!
        jobType ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {

        const career = await prisma.careers.create({
            data: {
                id: uuidv4(),
                position,
                positionCount:Number(positionCount),
                location,
                shortdescription,
                jobType
            }
        });

        return res.status(201).json({
            success: true,
            message: "Career created successfully",
          
        });

    } catch (error) {
        console.error("Error creating careers:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the careers"
        });
    }
};

export const getAllCareers = async (req, res) => {
    try {
        const career = await prisma.careers.findMany({
            orderBy: {
                createdAt: 'desc'  
            }
        });

        return res.status(200).json({
            success: true,
            message: "Careers fetched successfully",
            data: career
        });

    } catch (error) {
        console.error("Error fetching careers:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching careers"
        });
    }
};

export const getcareerByid = async (req, res) => {
    const { id } = req.params;
    try {
        const career = await prisma.careers.findUnique({
            where: { id },
          
        });

        if (!career) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Career fetched successfully",
            data: career
        });

    } catch (error) {
        console.error("Error fetching career:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the career"
        });
    }
}

export const updateCareer = async (req, res) => {
    const { id } = req.params;
     
    const { position, positionCount, location, shortdescription,jobType } = req.body;
    // Validate required fields
    if (!position || !positionCount||!location||!jobType) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }


    try {
        const existingCareer = await prisma.careers.findUnique({
            where: { id }
        });

        if (!existingCareer) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }
        const new_data ={position, positionCount:Number(positionCount), location, shortdescription,jobType }
      

        const updatedCareer = await prisma.careers.update({
            where: { id },
            data: {
                ...new_data,
                updatedAt: new Date()  
            }
        });

        return res.status(200).json({
            success: true,
            message: "Career updated successfully",
            data: updatedCareer
        });     

    } catch (error) {
        console.error("Error updating career:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the career"
        });
    }
};

export const deleteCareer= async (req, res) => {
    const { id } = req.params;    
    try {
        const existingCareer = await prisma.careers.findUnique({
            where: { id }
        });

        if (!existingCareer) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }
 
        await prisma.careers.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Career deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting career:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the career"
        });
    }
};


