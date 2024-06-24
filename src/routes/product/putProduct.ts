import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import z from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import path from 'path';
import { base64ToImage } from '../../utils/base64ToFile';
import fs from 'fs';
import { createSlug } from '../../utils/createSlug';

const publicImagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}

export async function putProduct(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/products/:productId', {
        schema: {
            tags: ['product'],
            body: z.object({
                productId: z.number().int(),
                name: z.string().optional(),
                image: z.string().optional(),
                price: z.number().nullable().optional(),
                priceWithDiscount: z.number().nullable().optional(),
                departmentId: z.number().nullable().optional(),
                description: z.string().nullable().optional(),
                color: z.string().optional(),
                slug: z.string().optional(),
                forSale: z.boolean().optional(),
            }),
            response: {
                200: z.object({ message: z.string() }),
                404: z.object({ message: z.string() }),
                500: z.object({ message: z.string(), error: z.any() }),
            },
        },
    }, async (request, reply) => {
        try {
            const { productId, name, image, price, priceWithDiscount, departmentId, description, color, forSale } = request.body;

            // Verificar e ajustar valores nulos
            const updatedProductData: any = {};
            if (name !== undefined) updatedProductData.name = name;
            if (image !== undefined) updatedProductData.image = image;
            if (price !== null && price !== undefined) updatedProductData.price = price;
            if (priceWithDiscount !== null && priceWithDiscount !== undefined) updatedProductData.priceWithDiscount = priceWithDiscount;
            if (departmentId !== null && departmentId !== undefined) updatedProductData.departmentId = departmentId;
            if (description !== undefined) updatedProductData.description = description;
            if (color !== undefined) updatedProductData.color = color;
            if (forSale !== undefined) updatedProductData.forSale = forSale;

            const updatedProduct = await prisma.products.update({
                where: { id: productId },
                data: updatedProductData,
            });

            if (!updatedProduct) {
                return reply.status(404).send({ message: `Product with ID ${productId} not found.` });
            }

            if (image) {
                const imagePath = path.join(publicImagesDir, `${updatedProduct.slug}.jpg`);
                try {
                    await base64ToImage(updatedProduct.image, imagePath);
                    updatedProduct.imagePath = `http://localhost:3333/images/${updatedProduct.slug}.jpg`;
                } catch (error) {
                    console.error(`Error saving image for product ${updatedProduct.id}:`, error);
                }
            }

            updatedProduct.slug = createSlug(updatedProduct.name)

            return reply.status(200).send({ message: 'Product updated successfully.' });
        } catch (error) {
            console.error('Internal Server Error:', error);
            return reply.status(500).send({ message: 'Internal Server Error', error });
        }
    });
}
