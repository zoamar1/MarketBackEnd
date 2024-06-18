import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteAdminById(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/admin/:id', {
    schema:{
      summary: 'Delete a admin',
      tags: ['admin'],
      params:z.object({
        id: z.preprocess(val=>Number(val), z.number().int())
      })
    }
  }, async (request, reply) => {
    try {
      const {id} = request.params

      const findAdmin = await prisma.admin.findUnique({
        where:{
          id
        }
      })

      if (!findAdmin){
        return reply.status(404).send({message: "Admin not found"})
      }
      
      const emailId = findAdmin.loginId

      const deleteAdmin = await prisma.admin.delete({
        where:{
          id,
        }
      })

      const deleteLogin = await prisma.login.delete({
        where:{
          id: emailId
        }
      }) 
 
      return reply.status(200).send({ message: "Admin deleted" });

    } catch (error) {
      return reply.status(500).send({
        statusCode: 500,
        code: "P2025",
        error: "Internal Server Error",
      })
    }
  })
}