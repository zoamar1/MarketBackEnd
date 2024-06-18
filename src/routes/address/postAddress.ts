import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function postAddresss(app : FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/endereco', {
    schema:{
      summary: 'Post an address',
      tags: ['address'],
      body: z.object({
        zip_code: z.string(),
        state: z.string(),
        city: z.string(),
        street: z.string(),
        number: z.number().int(),
        complement: z.string().nullable(),
      }),
      response: {
        201:z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const {zip_code, state, city, street, number, complement} = request.body
    
    const checkAddress = await prisma.addresses.findFirst({
      where: {
        zip_code: zip_code,
        number: number,
        complement: complement
      }
    })

    if (checkAddress) {
      return reply.status(409).send({message: "Address Already Exists"})
    }

    const createAddress = await prisma.addresses.create({
      data:{
        zip_code,
        state,
        city,
        street,
        number,
        complement
      }
    })
    return reply.status(201).send({message: "Address Created"})
  })
}