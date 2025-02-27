import prisma from "../helpers/prisma.js";
import { v4 as uuidv4 } from 'uuid';
import { deleteImageFromCloudinary, imageUploadToCloudinary } from "../helpers/image.upload.js";

export const createService = async (req, res) => {
    try {
        let { title, shortDescription, tagline, servicePoints } = req.body;
        console.log(req.body, "bodyy");

        if (!req.file) {
            return res.status(400).json({ message: 'No image provided', success: false });
        }

        // Convert servicePoints from string to array if needed
        if (typeof servicePoints === "string") {
            try {
                servicePoints = JSON.parse(servicePoints);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid format for servicePoints. It must be a JSON array."
                });
            }
        }

        // Validate required fields
        if (!title || !shortDescription || !tagline || !Array.isArray(servicePoints) || servicePoints.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields. Points must be a non-empty array."
            });
        }

        const folderPath = 'vsg/services';
        const result = await imageUploadToCloudinary(req.file, folderPath);

        const serviceId = uuidv4();

        // Create new service with related points
        const service = await prisma.service.create({
            data: {
                id: serviceId,
                title,
                shortDescription,
                tagline,
                image: result.secure_url,
                servicePoints: {
                    create: servicePoints.map(point => ({
                        id: uuidv4(),
                        text: point
                    }))
                }
            },
            include: {
                servicePoints: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service
        });

    } catch (error) {
        console.error("Error creating service:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the service"
        });
    }
};


export const getAllServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            include: {
                servicePoints: true
            },
            orderBy: {
                createdAt: 'desc'  // Most recent services first
            }
        });

        // Transform the response to match the expected format
        const formattedServices = services.map(service => ({
            ...service,
            points: service.servicePoints.map(point => point.text)
        }));

        return res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            data: formattedServices
        });

    } catch (error) {
        console.error("Error fetching services:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching services"
        });
    }
};

export const getServiceById = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                servicePoints: true
            }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Transform the response to match the expected format
        const formattedService = {
            ...service,
            points: service.servicePoints.map(point => point.text)
        };

        return res.status(200).json({
            success: true,
            message: "Service fetched successfully",
            data: formattedService
        });

    } catch (error) {
        console.error("Error fetching service:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the service"
        });
    }
};

export const updateService = async (req, res) => {
    const { id } = req.params;
    let { title, shortDescription, tagline, servicePoints } = req.body;

    console.log("Received Request Body:", req.body); // Debugging log

    try {
        // Parse servicePoints if sent as a JSON string
        if (typeof servicePoints === "string") {
            try {
                servicePoints = JSON.parse(servicePoints);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid format for servicePoints. Must be a JSON array."
                });
            }
        }

        // Validate required fields
        if (!title || !shortDescription || !tagline || !servicePoints || !Array.isArray(servicePoints)) {
            console.log("Validation Failed:", { title, shortDescription, tagline, servicePoints });
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields. servicePoints must be an array."
            });
        }

        // Check if service exists
        const existingService = await prisma.service.findUnique({
            where: { id },
            include: { servicePoints: true }
        });

        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Begin transaction
        const updatedService = await prisma.$transaction(async (prisma) => {
            const updateData = { 
                title, 
                shortDescription, 
                tagline, 
                updatedAt: new Date() 
            };

            // Handle image upload if a new file is provided
            if (req.file) {
                if (existingService.image) {
                    const publicId = existingService.image.split('/').slice(7, -1).join('/') + '/' + existingService.image.split('/').pop().split('.')[0];
                    await deleteImageFromCloudinary(publicId);
                }

                const folderPath = 'vsg/services';
                const result = await imageUploadToCloudinary(req.file, folderPath);
                updateData.image = result.secure_url;
            }

            // Delete all existing servicePoints
            await prisma.servicePoint.deleteMany({
                where: { serviceId: id }
            });

            // Create new servicePoints
            await prisma.servicePoint.createMany({
                data: servicePoints.map(point => ({
                    id: uuidv4(),
                    text: point,
                    serviceId: id
                }))
            });

            // Update service record
            return prisma.service.update({
                where: { id },
                data: updateData,
                include: { servicePoints: true }
            });
        });

        // Format response
        const formattedService = {
            ...updatedService,
            servicePoints: updatedService.servicePoints.map(point => point.text)
        };

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: formattedService
        });

    } catch (error) {
        console.error("Error updating service:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the service"
        });
    }
};

export const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if service exists
        const existingService = await prisma.service.findUnique({
            where: { id }
        });

        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Delete the image from Cloudinary
        if (existingService.image) {
            const publicId = existingService.image.split('/').slice(7, -1).join('/') + '/' + existingService.image.split('/').pop().split('.')[0];
            await deleteImageFromCloudinary(publicId);
        }

        // Delete service (will cascade delete all service points due to onDelete: Cascade)
        await prisma.service.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting service:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the service"
        });
    }
};