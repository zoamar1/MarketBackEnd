import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { number } from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteStorageProductByProductId(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/produtos/:productId/:size', {
    schema:{
      params:z.object({
        productId:z.preprocess(val=>Number(val), z.number().int()),
        size: z.string()
      })
    }
  }, async (request, reply) => {
    const {productId, size} = request.params

    const StorageProduct = await prisma.storageProduct.findFirst({
      where: {productId, size}
    })

    if(!StorageProduct){
      return reply.status(404).send('StorageProduct not found')
    }

    const deleteStorageProduct = await prisma.storageProduct.delete({
      where:{id: StorageProduct.id}
    })

    if (deleteStorageProduct){
      return reply.status(200).send("StorageProduct deleted")
    }
  })
}