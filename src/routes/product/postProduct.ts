import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { createSlug } from "../../utils/createSlug";

export async function postProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/produtos/', {
      schema: {
        body: z.object({
          name: z.string(),
          price: z.number().finite(),
          priceWithDiscount: z.number().finite().nullable(),
          description: z.string().nullable(),
          color: z.string(),
          departmentName: z.string()
        }),
        response: {
          201: z.object({
            message: z.string(),
            slug: z.string()
          })
          ,404: z.object({
            message: z.string()
          })
        }
      }
    }, async (request, reply) => {
      const { name, price, priceWithDiscount, description, color, departmentName } = request.body
      console.log(departmentName)

      const department = await prisma.departments.findFirst({
        where: {
          name: departmentName
        }
      });

      if (!department) {
        return reply.status(404).send({ message: "Department not found" });
      }

      const slugProduct = createSlug(name)

      const createProduct = await prisma.products.create({
        data: {
          name,
          price,
          priceWithDiscount,
          departmentId: department.id,
          description,
          color,
          slug: slugProduct,
          forSale: true
        }
      })

      return reply.status(201).send({ message: "Product Created", slug: slugProduct})
    })
}


