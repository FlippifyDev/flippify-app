import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve eBay API key and MongoDB URI from environment variables
EBAY_API_KEY = os.getenv('EBAY_API_KEY')
MONGODB_URI = os.getenv('MONGODB_URI')

# MongoDB connection
client = MongoClient(MONGODB_URI)
db = client.get_database()
users_collection = db['users']  # Replace 'users' with your collection name

def get_ebay_user_data(discord_id):
    # Replace the endpoint with the correct eBay API endpoint
    # This is a placeholder for demonstration purposes
    url = "https://api.ebay.com/identity/v1/oauth2/token"

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Bearer {EBAY_API_KEY}',
    }

    payload = {
        'grant_type': 'authorization_code',
        'code': discord_id,  # Assuming discord_id is used to retrieve the eBay user's authorization code
        #probably a session token from login that has to be passed in here rather than discord_id
    }

    response = requests.post(url, headers=headers, data=payload)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get eBay user data: {response.status_code}")
        return None

def link_ebay_account_to_user(discord_id):
    user = users_collection.find_one({"discord_id": discord_id})

    if not user:
        print(f"User with Discord ID {discord_id} not found.")
        return

    ebay_user_data = get_ebay_user_data(discord_id)

    if ebay_user_data:
        update_data = {
            'ebay_user_id': ebay_user_data['ebay_user_id'],  # Adjust according to the actual eBay response
            'ebay_access_token': ebay_user_data['access_token'],  # Store the access token if needed
            # Add any other fields you need to store
            #this is storing the users ebay data from the ebay api oin the mongodb database users colection
        }

        result = users_collection.update_one({"discord_id": discord_id}, {"$set": update_data})

        if result.modifiedCount > 0:
            print(f"eBay account linked successfully for user {user['username']}")
        else:
            print(f"No changes were made to the user {user['username']}")
    else:
        print(f"Failed to retrieve eBay user data for Discord ID {discord_id}.")
    #print statements can be passed back to front end 

if __name__ == "__main__":
    # Example usage
    discord_id = "995698711898361898"  # Replace with the actual Discord ID of the user
    link_ebay_account_to_user(discord_id)
