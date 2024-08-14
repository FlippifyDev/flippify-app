// pages/api/lego/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from 'app/lib/mongodb'; // Adjust the path if needed
import { LegoProduct } from 'app/api/legoM/productModel'; // Ensure this path is correct

export async function GET() {
  await dbConnect();

  try {
    // Fetch Lego products from the database
    const legoProducts = await LegoProduct.find({}).exec(); // Fetch all Lego products
    return NextResponse.json({ products: legoProducts });
  } catch (error) {
    console.error('Error fetching Lego products:', error);
    return NextResponse.json({ error: 'Failed to fetch Lego products' }, { status: 500 });
  }
}

// Optionally handle other HTTP methods if needed
export async function POST(req: NextRequest) {
  // Handle POST requests here, for example, to create a new Lego product
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    // Parse the request body to get update details
    const { _id, updateData } = await req.json();

    // Validate the required fields
    if (!_id || !updateData) {
      return NextResponse.json({ error: 'Product ID and update data are required' }, { status: 400 });
    }

    // Update the Lego product with new data
    const result = await LegoProduct.updateOne(
      { _id },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No product found or no changes detected' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating Lego product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
