import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createSlug } from "../../utils/createSlug";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

// Função para converter imagem em base64
async function convertImageToBase64(imagePath: string): Promise<string> {
  try {
    const imageBuffer = await readFile(imagePath);
    const base64Image = imageBuffer.toString("base64");
    return base64Image;
  } catch (error :any) {
    throw new Error(`Failed to convert image to base64: ${error.message}`);
  }
}

export async function postProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/produtos/', {
      schema: {
        body: z.object({
          name: z.string(),
          image: z.string(),
          price: z.number().finite(),
          priceWithDiscount: z.number().finite().nullable(),
          description: z.string().nullable(),
          color: z.string(),
          departmentName: z.string()
        }),
        response: {
          201: z.object({
            message: z.string(),
            slug: z.string()
          }),
          404: z.object({
            message: z.string()
          })
        }
      }
    }, async (request, reply) => {
      const { name, image: imagePath, price, priceWithDiscount, description, color, departmentName } = request.body;

      const department = await prisma.departments.findFirst({
        where: {
          name: departmentName
        }
      });

      if (!department) {
        return reply.status(404).send({ message: "Department not found" });
      }

      let base64Image: string | undefined;

      try {
        base64Image = await convertImageToBase64(imagePath);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Failed to process image" });
      }

      const slugProduct = createSlug(name);

      const createProduct = await prisma.products.create({
        data: {
          name,
          image: base64Image, // Armazenando a imagem em base64
          price,
          priceWithDiscount,
          departmentId: department.id,
          description,
          color,
          slug: slugProduct,
          forSale: true
        }
      });

      return reply.status(201).send({ message: "Product Created", slug: slugProduct });
    });
}
