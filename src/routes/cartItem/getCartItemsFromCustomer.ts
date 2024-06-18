import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";



export async function getCartItemsFromCustomer(app:FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>().get('/itensCarrinho/:customersId',
    {
      schema:{
        summary: 'Get cartItems from customer by ID',
        tags: ['cartItem'],
        params:z.object({
          customersId: z.preprocess((val) => Number(val), z.number().int())
        })
      }
    }, async (request,reply) => {
      const {customersId} = request.params as {customersId?: number}

      if (customersId === undefined) {
        return reply.status(404).send('customerId was not found')
      }

      const getCartItems = await prisma.cart.findMany({
        where:{
          customersId,
        },
        select:{
          CartItems: {
            select: {
              id:true,
              cartId: true,
              productId: true,
              qty:true,
              Product:{
                select:{
                  id: true,
                  name: true,
                  price: true,
                  priceWithDiscount:true,
                  forSale:true,
                  itemProduct: {
                    select:{
                      size: true,
                    }
                  }
                }
              }
            }
          }
        }
      })

      if(getCartItems.length === 0){
        return reply.status(404).send("No cartItem was found")
      }

      return reply.status(200).send(getCartItems)
    }
  )
}