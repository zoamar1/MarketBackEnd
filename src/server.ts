import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
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
import { getAllAdmins } from "./routes/admin/getAllAdmins";
import { getAllCartItems } from "./routes/cartItem/getAllCartItems";
import { getAllLogins } from "./routes/login/getAllLogins";
import { getAllOrders } from "./routes/order/getAllOrders";
import { getAllProducts } from "./routes/product/getAllProducts";
import { getAllStorageProducts } from "./routes/storageProduct/getAllStorageProducts";
import { getCartItemsFromCustomer } from "./routes/cartItem/getCartItemsFromCustomer";
import { getAddressesFromCustomer } from "./routes/address/getAddressesFromCustomer";
import { getOrdersFromUsers } from "./routes/order/getOrdersFromCustomer";
import { deleteAdminById } from "./routes/admin/deleteAdminById";
import { deleteStorageProductByProductId } from "./routes/storageProduct/deleteStorageProductByProductId";
import { postAdmin } from "./routes/admin/postAdmin";
import { deleteCartItemById } from "./routes/cartItem/deleteCartItemById";
import { deleteAddressById } from "./routes/address/deleteAddressById";


const app = fastify()


app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(postCustomer)
app.register(postProduct)
app.register(postLogin)
app.register(postDepartment)
app.register(postStorageProduct)
app.register(postAddresss)
app.register(postCartItem)
app.register(postOrder)
app.register(postAdmin)

app.register(getProductsFromDepartment)
app.register(getAllDepartments)
app.register(getAllCustomers)
app.register(getAllAddresses)
app.register(getAllAdmins)
app.register(getAllCartItems)
app.register(getAllLogins)
app.register(getAllOrders)
app.register(getAllProducts)
app.register(getAllStorageProducts)
app.register(getCartItemsFromCustomer)
app.register(getAddressesFromCustomer)
app.register(getOrdersFromUsers)

app.register(deleteAdminById)
app.register(deleteStorageProductByProductId)
app.register(deleteCartItemById)
app.register(deleteAddressById)


app.listen({port: 3333}).then(() => {
  console.log("HTTP server running! http://localhost:3333")
})