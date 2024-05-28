import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAddressesFromCustomer(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/endereco/:userId', {
    schema: {
      params: z.object({
        userId: z.preprocess(val=>Number(val), z.number().int())
      })
    }
  }, async (request,reply) => {
    const {userId} = request.params
 
    const getAddress = await prisma.customers.findFirst({
      where:{id:userId}, select:{Address:true}
    })

    if(!getAddress){
      return reply.status(404).send("No address was found")
    }
    return reply.status(200).send(getAddress)
  })
}