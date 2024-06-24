import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import authenticate from "../../utils/authenticate";

export async function getCartItemsFromCustomer(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/itensCarrinho/usuario', {
    schema: {
      summary: 'Get cartItems from customer by ID',
      tags: ['cartItem'],
      headers: z.object({
        authorization: z.string(),
      }),
    },
    preHandler: [authenticate],
  }, async (request, reply) => {
    const userId = (request as any).user?.id;

    if (!userId) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const getCartItems = await prisma.cart.findMany({
        where: {
          customersId: userId,
        },
        select: {
          CartItems: {
            select: {
              id: true,
              cartId: true,
              productId: true,
              qty: true,
              Product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imagePath: true,
                  priceWithDiscount: true,
                  forSale: true,
                  itemProduct: {
                    select: {
                      size: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (getCartItems.length === 0) {
        return reply.status(404).send("No cartItem was found");
      }

      return reply.status(200).send(getCartItems);
    } catch (error) {
      console.error("Error retrieving cart items:", error);
      return reply.status(500).send("Internal Server Error");
    }
  });
}
