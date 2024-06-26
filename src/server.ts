import fastify from "fastify";
import { join } from "path";
import cors from '@fastify/cors';
import fastifyStatic from "@fastify/static";
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { postCustomer } from "./routes/customer/postCustomer";
import { postProduct } from "./routes/product/postProduct";
import { postLogin } from "./routes/login/postLogin";
import { postDepartment } from "./routes/department/postDepartment";
import { postStorageProduct } from "./routes/storageProduct/postStorageProduct";
import { postAddresss } from "./routes/address/postAddress";
import { postCartItem } from "./routes/cartItem/postCartItem";
import { postOrder } from "./routes/order/postOrder";
import { getProductsFromDepartment } from "./routes/product/getProductsFromDepartment";
import { getAllDepartments } from "./routes/department/getAllDepartments";
import { getAllCustomers } from "./routes/customer/getAllCustomers";
import { getAllAddresses } from "./routes/address/getAllAddresses";
import { getAllCartItems } from "./routes/cartItem/getAllCartItems";
import { getAllLogins } from "./routes/login/getAllLogins";
import { getAllOrders } from "./routes/order/getAllOrders";
import { getAllProducts } from "./routes/product/getAllProducts";
import { getAllStorageProducts } from "./routes/storageProduct/getAllStorageProducts";
import { getCartItemsFromCustomer } from "./routes/cartItem/getCartItemsFromCustomer";
import { getAddressesFromCustomer } from "./routes/address/getAddressesFromCustomer";
import { getOrdersFromUsers } from "./routes/order/getOrdersFromCustomer";
import { deleteStorageProductByProductId } from "./routes/storageProduct/deleteStorageProductByProductId";
import { deleteCartItemById } from "./routes/cartItem/deleteCartItemById";
import { deleteAddressById } from "./routes/address/deleteAddressById";
import { putProductChangeStateForSale } from "./routes/product/putProductChangeStateForSale";
import { putUpdateCustomerAddress } from "./routes/customer/putUpdateCustomerAddress";
import { putUpdatePasswordByEmail } from "./routes/login/putUpdatePasswordByEmail";
import { putUpdateOrderStatus } from "./routes/order/putUpdateOrderStatus";
import { putUpdateStorage } from "./routes/storageProduct/putUpdateStorage";
import { getStorageProductsFromProduct } from "./routes/storageProduct/getStorageProductsFromProduct";
import { loginLogin } from "./routes/login/loginLogin"
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { logout } from "./routes/login/logout";
import { postIsAdmin } from "./routes/login/postIsAdmin";
import { putProduct } from "./routes/product/putProduct";
import { getCustomerFromToken } from "./routes/customer/getCustomerFromToken";
import { getLoginFromToken } from "./routes/login/getLoginFromToken";

const app = fastify();


app.register(fastifyJwt, {
  secret: 'zoamar'
});

app.register(fastifyCookie);

app.register(fastifySwagger,{
  swagger:{
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'zoamar',
      description: 'Especificações da API para o back-end da aplicação Zoamar construída',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})



app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})


app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyStatic, {
  root: join(__dirname, '../src/public/images'), 
  prefix: '/images/',
});

app.register(postCustomer);
app.register(postProduct);
app.register(postLogin);
app.register(postDepartment);
app.register(postStorageProduct);
app.register(postAddresss);
app.register(postCartItem);
app.register(postOrder);


app.register(getProductsFromDepartment);
app.register(getAllDepartments);
app.register(getAllCustomers);
app.register(getAllAddresses);

app.register(getAllCartItems);
app.register(getAllLogins);
app.register(getAllOrders);
app.register(getAllProducts);
app.register(getAllStorageProducts);
app.register(getCartItemsFromCustomer);
app.register(getAddressesFromCustomer);
app.register(getOrdersFromUsers);
app.register(getStorageProductsFromProduct);


app.register(deleteStorageProductByProductId);
app.register(deleteCartItemById);
app.register(deleteAddressById);

app.register(putProductChangeStateForSale);
app.register(putUpdateCustomerAddress);
app.register(putUpdatePasswordByEmail);
app.register(putUpdateOrderStatus);
app.register(putUpdateStorage);
app.register(putProduct)

app.register(loginLogin)
app.register(logout)
app.register(postIsAdmin)
app.register(getCustomerFromToken)
app.register(getLoginFromToken)

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], 
});

const port = Number(process.env.PORT) || 3333;

app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running! http://localhost:${port}`);
});