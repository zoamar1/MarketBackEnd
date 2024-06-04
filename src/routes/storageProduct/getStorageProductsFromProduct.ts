import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getStorageProductsFromProduct(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/produto/:productId/estoque', {
    schema:{
      params: z.object({
        productId: z.preprocess(val=>Number(val), z.number().int())
      })
    }}, async (request,reply) => {
      const {productId} = request.params

      const storageProducts = await prisma.storageProduct.findMany({
        where:{productId,}
      })

      if(storageProducts.length === 0){
        return reply.status(404).send("No storageProduct was fonud")
      }

      return reply.status(200).send(storageProducts)
    })
}