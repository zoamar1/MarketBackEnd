import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";


export async function postAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/admin', {
    schema:{
      body: z.object({
        name: z.string(),
        loginId: z.number().int(),
        sector: z.string()
      }),
      response:{
        201: z.object({message: z.string()})
      }
    }
  }, async (request, response) => {
      const {name, loginId, sector} = request.body
      const postAdmin = await prisma.admin.create({
        data:{
          name,
          loginId,
          sector
        }
      })
      return response.status(201).send({message: "Admin Created"})
  })
}