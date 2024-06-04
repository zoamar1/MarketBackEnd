import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putUpdatePasswordByEmail(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/login/mudarSenha',{
    schema:{
    body: z.object({
      email: z.string().email(),
      newPassword: z.string().min(1).max(25),
    })
  }}, async (request, reply) => {
    const {email, newPassword} = request.body

    const updatePassword = await prisma.login.update({
      where: {email},
      data: {password: newPassword}
    })

    if (!updatePassword){
      return reply.status(404).send("No login was found")
    }
    return reply.status(200).send("Password updated")
  })
}