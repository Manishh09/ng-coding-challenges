import { inject, Injectable } from "@angular/core";
import { OrderService } from "./order.service";
import { ProductService } from "./product.service";
import { Order } from "../models/order.model";
import { catchError, concatMap, from, map, Observable, of, toArray } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CheckoutFacadeService {

    private orderService = inject(OrderService);
    private productService = inject(ProductService);

    checkout(order: Order): Observable<Order> {
        // create order
        return this.orderService.createOrder(order).pipe(
            // process products inventory update sequentially
            concatMap(createdOrder => {
                 
                // Note:  from(createdOrder.products) will emit each product one by one
                return from(createdOrder.products).pipe(
                    // update inventory for each product sequentially
                    concatMap(product =>
                        this.productService.updateInventory(product.id, product.stock - (product.quantity || 0))
                        .pipe(catchError(() => of(null))), // continue even if a product fails
                    ),

                    toArray(), // wait until all product updates finish

                    map(() => createdOrder), // pass the created order for the next step

                    // after updating inventory, process payment
                    concatMap(() =>
                        this.orderService.processPayment(createdOrder.id!).pipe(
                            map(payment => ({ ...createdOrder, paymentStatus: payment.status }))
                        )
                    )
                );

            }),

        );
    }

}
