import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function postStorageProduct(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/produtos/estoque',{
    schema:{
      summary: 'Create a storageProduct',
      tags: ['storageProduct'],
      body:z.object({
        size: z.string(),
        storage: z.number().int(),
        productName: z.string()
      }),
      response:{
        201:z.object({
          message: z.string()
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const {size, storage, productName} = request.body


    const product = await prisma.products.findFirst({
      where:{
        slug: productName
      }
    })

    if (!product){
      return reply.status(404).send({message: "Storage Product Created" })
    }

  const createStorageProduct = await prisma.storageProduct.create({
    data:{
      productId: product.id,
      size,
      storage,
    }
  })

  return reply.status(201).send({message: "Storage Product Created"})

  })
}