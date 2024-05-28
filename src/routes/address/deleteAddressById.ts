import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteAddressById(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/endereco/:addressId', {
    schema:{
      params:z.object({
        addressId: z.preprocess(val=> Number(val), z.number().int())
      })
    }
  }, async (request, reply) => {
    const {addressId} = request.params

    const address = await prisma.addresses.findUnique({
      where:{id:addressId}
    })

    if(!address){
      return reply.status(404).send('No address was found')
    }

    const deleteAddress = await prisma.addresses.delete({
      where:{id: address.id}
    })

    return reply.status(200).send('Address deleted')
  })
}