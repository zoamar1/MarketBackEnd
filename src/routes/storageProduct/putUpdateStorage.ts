import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";


export async function putUpdateStorage(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/produtosEstoque/estoque', {
    schema:{
      body:z.object({
        productId:z.number().int(),
        size:z.string(),
        storage: z.number().int()
      })
    }}, async (request,reply) => {
      const {productId, size, storage} = request.body

      const findStorageProduct = await prisma.storageProduct.findFirst({
        where:{
          productId,
          size,
        }
      })

      if(!findStorageProduct){
        return reply.status(404).send("StorageProduct not found")
      }

      const updateStorage = await prisma.storageProduct.update({
        where:{id: findStorageProduct.id},
        data:{storage}
      })

      return reply.status(200).send({message:
        `Updated storage of storageProduct ${findStorageProduct.id} to ${storage}`})
    })
}