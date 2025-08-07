import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { products } from '@/mock/products';

// Define the type for CreateInvoiceProductDto
type CreateInvoiceProductDto = {
  productId: number;
  quantity: number;
};

@ValidatorConstraint({ name: 'quantityExceedsStock', async: false })
export class QuantityExceedsStock implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    // Cast args.object to the expected type
    const productData = args.object as CreateInvoiceProductDto;

    // Get productId and quantity
    const productId = productData.productId;
    const quantity = value;

    // Find the product by productId
    const product = products.find((p) => p.id === productId);

    // If product is not found, return false
    if (!product) {
      return false;
    }

    // Check if quantity exceeds stock
    return quantity <= product.stock;
  }

  defaultMessage(args: ValidationArguments): string {
    const productData = args.object as CreateInvoiceProductDto;
    const productId = productData.productId;

    // Find the product by productId
    const product = products.find((p) => p.id === productId);

    // Use optional chaining to safely access properties
    return `Quantity for product "${product?.name}" exceeds available stock (${product?.stock})`;
  }
}
