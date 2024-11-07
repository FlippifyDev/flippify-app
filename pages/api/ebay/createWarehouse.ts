import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customerId, accessToken, payload } = req.body;
  
  if (!accessToken || !payload) {
    return res.status(400).json({ error: "Access token or payload is missing" });
  }

  try {
    const response = await fetch(`https://api.ebay.com/sell/inventory/v1/location/${customerId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Res", response)

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating warehouse:", errorData);
      return res.status(response.status).json({ error: `Error creating warehouse: ${errorData.message}` });
    }

    const data = await response.json();
    console.log("Data", data)
    return res.status(200).json({ result: data }); // Sending the response back to the frontend
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
}
