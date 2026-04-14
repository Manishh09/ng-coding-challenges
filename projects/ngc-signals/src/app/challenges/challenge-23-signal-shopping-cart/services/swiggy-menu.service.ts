import { Injectable } from '@angular/core';
import { Coupon, MenuItem, Restaurant } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class SwiggyMenuService {

  getRestaurant(): Restaurant {
    return {
      name: 'Punjab Grill',
      cuisine: 'North Indian, Mughlai, Biryani',
      rating: 4.3,
      deliveryTime: '25-30 min',
      costForTwo: 600
    };
  }

  getMenuItems(): MenuItem[] {
    return [
      {
        id: 1,
        name: 'Butter Chicken',
        price: 320,
        description: 'Creamy tomato-based chicken curry, a signature classic',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 2,
        name: 'Paneer Tikka',
        price: 240,
        description: 'Chargrilled cottage cheese marinated in tandoori spices',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 3,
        name: 'Veg Biryani',
        price: 180,
        description: 'Fragrant basmati rice layered with seasonal vegetables',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 4,
        name: 'Garlic Naan (2 pcs)',
        price: 80,
        description: 'Soft tandoor bread topped with garlic and butter',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 5,
        name: 'Gulab Jamun (2 pcs)',
        price: 99,
        description: 'Deep-fried milk dumplings soaked in sugar syrup',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 6,
        name: 'Masala Dosa',
        price: 120,
        description: 'Crispy crepe filled with spiced potato masala',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 7,
        name: 'Chicken Biryani',
        price: 280,
        description: 'Hyderabadi-style dum biryani with tender chicken',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 8,
        name: 'Dal Makhani',
        price: 220,
        description: 'Slow-cooked black lentils with cream and butter',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 9,
        name: 'Tandoori Roti (4 pcs)',
        price: 60,
        description: 'Whole wheat flatbread baked in a clay oven',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 10,
        name: 'Lassi (Sweet)',
        price: 70,
        description: 'Chilled yogurt drink blended with sugar and cardamom',
        isVeg: true,
        isBestseller: false
      }
    ];
  }

  getAvailableCoupons(): Coupon[] {
    return [
      { code: 'SWIGGY20', discountPercent: 20, label: '20% off on your order' },
      { code: 'WELCOME50', discountPercent: 50, label: '50% off up to ₹100 for new users' },
      { code: 'FREEDEL', discountPercent: 0, label: 'Free delivery on orders above ₹149' }
    ];
  }
}
