import { NextRequest, NextResponse } from 'next/server';
import dbConnect from 'app/lib/mongodb'; // Adjust if needed
import { ElectronicsProduct } from 'app/api/deals-watchM/productModel'; // Ensure this path is correct

export async function GET() {
  await dbConnect();
  console.log("Connected to the database successfully");

  try {
    // Fetch electronics products from the database
    const electronicsProducts = await ElectronicsProduct.find({}).exec(); // Fetch all electronics products
    console.log('Electronics products:', electronicsProducts); // Debugging line
    return NextResponse.json({ products: electronicsProducts });
  } catch (error) {
    console.error('Error fetching electronics products:', error); // Log the entire error object
    return NextResponse.json({ error: 'Failed to fetch electronics products', details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Handle POST requests here, for example, to create a new electronics product
  await dbConnect();

  try {
    const newProductData = await req.json();
    const newProduct = new ElectronicsProduct(newProductData);
    await newProduct.save();
    return NextResponse.json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating electronics product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
}

