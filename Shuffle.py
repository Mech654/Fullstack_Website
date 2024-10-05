import sqlite3
import random

try:
    # Connect to the SQLite database
    conn = sqlite3.connect('example.db')
    cursor = conn.cursor()

    # Retrieve all data from the products table
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    # Check if products were retrieved
    if not products:
        print("No products found in the database.")
    else:
        # Shuffle the data
        random.shuffle(products)

        # Remove all items from the products table
        cursor.execute("DELETE FROM products")

        # Insert the shuffled data back into the products table
        for product in products:
            cursor.execute("INSERT INTO products VALUES (?, ?, ?, ?)", product)

        # Commit the changes
        conn.commit()
        print("Products shuffled successfully.")

except sqlite3.Error as e:
    print(f"An error occurred: {e}")

finally:
    # Close the connection
    if conn:
        conn.close()
