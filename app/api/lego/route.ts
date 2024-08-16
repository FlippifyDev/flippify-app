import { NextRequest, NextResponse } from 'next/server';
import dbConnect from 'app/lib/mongodb'; // Adjust the path if needed
import { LegoProduct } from 'app/api/legoM/productModel'; // Ensure this path is correct

export async function GET() {
  await dbConnect();
  console.log("connected to the database succses");

  try {
    // Fetch Lego products from the database
    const legoProducts = await LegoProduct.find({}).exec(); // Fetch all Lego products
    console.log('Lego products:', legoProducts); // Debugging line
    return NextResponse.json({ products: legoProducts });
  } catch (error) {
    console.error('Error fetching Lego products:', error); // Log the entire error object
    return NextResponse.json({ error: 'Failed to fetch Lego products', details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Handle POST requests here, for example, to create a new Lego product
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { _id, updateData } = await req.json();
    if (!_id || !updateData) {
      return NextResponse.json({ error: 'Product ID and update data are required' }, { status: 400 });
    }

    const result = await LegoProduct.updateOne({ _id }, { $set: updateData });
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No product found or no changes detected' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating Lego product:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}
