import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { base64ToImage } from "../../utils/base64ToFile";
import path from "path";
import fs from 'fs'


const publicImagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

export async function getAllProducts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/produtos', {
    schema: {
      summary: 'Get all products',
      tags: ['product'],
      querystring:z.object({forSale:z.preprocess(val=>Boolean(val), z.boolean())})
      ,
      response:{
        200:z.object({array: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()})
      }
    }
  }, async (request, reply) => {
    try {
      const forSale = request.query.forSale
      let products
      if(forSale !== null){
         products = await prisma.products.findMany({where:{forSale:true}})
      }
      products = await prisma.products.findMany({where:{}})


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
      
      if (products.length === 0) {
        return reply.status(404).send({message: "No products was found"})
      }
      return reply.status(200).send({array: products})
    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}