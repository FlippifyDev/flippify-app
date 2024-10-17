"use server";

import mongoose from 'mongoose';
import { IProduct, productSchema } from './productModel';

const ProductsConfig = mongoose.models['config.products'] || mongoose.model<IProduct>('config.products', productSchema);

async function fetchProducts() {
  try {
    const products: IProduct[] = await ProductsConfig.find({}).exec(); 

    // Create a map to store unique subscriptions
    const subscriptionMap = new Map<string, { role_id: string; override: boolean; server_subscription: boolean }>();

    products.forEach(product => {
      // Access fields using bracket notation
      const subscriptionName = product['subscription-name'];
      const subscriptionNameServer = product['subscription-name-server'];
      const roleId = product['role-id'];
      const roleIdServer = product['role-id-server'];
      const override = false;
      const serverSubscription = false;
      
      if (subscriptionName) {
        // Store or update the subscription in the map
        if (!subscriptionMap.has(subscriptionName)) {
          subscriptionMap.set(subscriptionName, { role_id: roleId, override, server_subscription: false });
        }
      }

      if (subscriptionNameServer) {
        // Store or update the subscription in the map
        if (!subscriptionMap.has(subscriptionNameServer)) {
          subscriptionMap.set(subscriptionNameServer, { role_id: roleIdServer, override, server_subscription: true });
        }
      }
    });

    const uniqueSubscriptions = Array.from(subscriptionMap.entries()).map(([name, { role_id, override, server_subscription }]) => ({
      name,
      role_id: role_id,
      override,
      server_subscription,
    }));
    
    // Adding manually specified roles with string role_id
    uniqueSubscriptions.push(
      { name: 'accessGranted', role_id: '0', override: false, server_subscription: false },
      { name: 'admin', role_id: '0', override: false, server_subscription: false }
    );

    return uniqueSubscriptions;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export default fetchProducts;
