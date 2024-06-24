import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import authenticate from '../../utils/authenticate';

export async function postCartItem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/cliente/carrinho', {
      schema: {
        summary: 'Post a cartItem',
        tags: ['cartItem'],
        headers: z.object({
          authorization: z.string(),
        }),
        body: z.object({
          productId: z.number().int(),
          qty: z.number().int().positive(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          })
        },
      },preHandler: [authenticate]
    }, async (request, reply) => {
      const productId = request.body.productId;
      const qty = request.body.qty;
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.status(401).send({error:'Unauthorized'});
      }

      try {
        const customer = await prisma.customers.findUnique({
          where: { id: userId },
        });

        if (!customer) {
          return reply.status(404).send({ message: "Customer Doesn't Exist" });
        }

        const cart = await prisma.cart.findFirst({
          where: { customersId: userId },
          include: { CartItems: true },
        });

        if (!cart) {
          return reply.status(404).send({ message: "Customer's Cart Not Found" });
        }

        const existingCartItem = cart.CartItems.find((item) => item.productId === productId);

        if (existingCartItem) {
          return reply.status(409).send({ error: 'This product already exists in this cart' });
        }

        const createCartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            qty,
          },
        });

        return reply.status(201).send({ message: "CartItem Created" });
      } catch (error) {
        console.error('Error adding cart item:', error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
}
