import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";


export async function getAllAddresses(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/enderecos', {
    schema: {
      summary: 'Get all addresses',
      tags: ['address'],
      response:{
        200:z.object({array: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()})
      }
    }
  }, async (request, reply) => {
    try {
      const addresses = await prisma.addresses.findMany({})
      if (addresses.length === 0) {
        return reply.status(404).send({message: "No addresses was found"})
      }
      return reply.status(200).send({array: addresses})
    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}