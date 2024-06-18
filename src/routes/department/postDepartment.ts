import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createSlug } from "../../utils/createSlug";

export async function postDepartment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/departamento', {
    schema: {
      summary: 'Post a department',
      tags: ['department'],
      body: z.object({
        name: z.string()
      }),
      response: {
        201: z.object({ message: z.string(), departmentName: z.string() })
      }
    }
  }, async (request, reply) => { 
    const name = request.body.name
    const department = createSlug(name)

    const createDepartment = await prisma.departments.create({
      data: {
        name: department
      }
    })

    return reply.status(201).send({message: "Department Created", departmentName: department })
  })
}