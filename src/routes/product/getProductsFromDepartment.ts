import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { base64ToImage } from "../../utils/base64ToFile";
import fs from "fs";
import path from "path";
import { putProduct } from "./putProduct";

const publicImagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

export async function getProductsFromDepartment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/produtos/:departmentId', {
    schema: {
      summary: 'Get all products from a department',
      tags: ['product'],
      params: z.object({
        departmentId: z.preprocess(val => Number(val), z.number().int())
      }),
      querystring: z.object({
        name: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        forSale: z.preprocess(val => val === 'true' || val === 'false' ? val === 'true' : val, z.boolean().optional()),
        minPrice: z.preprocess(val => {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        }, z.number().finite().optional()),
        maxPrice: z.preprocess(val => {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        }, z.number().finite().optional())
      })
    }
  }, async (request, reply) => {
    const { departmentId } = request.params;
    const { name, size, color, forSale, minPrice, maxPrice } = request.query;

    console.log("Query parameters:", { name, size, color, forSale, minPrice, maxPrice });

    let products = await prisma.products.findMany({
      where: { departmentId },
      include: { itemProduct: true }
    });

    console.log("Initial products:", products);

    if (forSale === true) {
      products = await prisma.products.findMany({
        where: { departmentId, forSale: true },
        include: { itemProduct: true }
      });
    }

    if (name) {
      products = products.filter(product => product.name.includes(name));
    }

    if (size) {
      products = products.filter(product =>
        product.itemProduct.some(item => item.size === size));
    }

    if (minPrice !== undefined) {
      products = products.filter(product => {
        if (product.priceWithDiscount) {
          return product.priceWithDiscount >= minPrice;
        } else {
          return product.price >= minPrice;
        }
      });
    }

    if (maxPrice !== undefined) {
      products = products.filter(product => {
        if (product.priceWithDiscount) {
          return product.priceWithDiscount <= maxPrice;
        } else {
          return product.price <= maxPrice;
        }
      });
    }

    if (color) {
      products = products.filter(product => product.color === color);
    }

    console.log("Filtered products:", products);

    for (let product of products) {
      if (product.image) {
        const imagePath = path.join(publicImagesDir, `${product.slug}.jpg`);
        try {
          await base64ToImage(product.image, imagePath);
          product.imagePath = `http://localhost:3333/images/${product.slug}.jpg`;
        } catch (error) {
          console.error(`Error saving image for product ${product.id}:`, error);
        }
      }
    }

    return reply.status(200).send(products);
  });
}
