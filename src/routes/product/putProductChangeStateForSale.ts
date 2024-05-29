import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putProductChangeStateForSale(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/produto/aVenda', {
    schema:{
      body:z.object({
        id: z.number().int(),
        boolean: z.boolean()
      })
    }
  }, async (request,reply) => {
    const {id, boolean} = request.body

    const updatedProduct = await prisma.products.update({
      where:{id},
      data:{forSale:boolean}
    })

    if(!updatedProduct){
      return reply.status(404).send({message: "Product not found"})
    }

    return reply.status(200).send({ message: `Product forSale set to ${boolean}` });
  })
}