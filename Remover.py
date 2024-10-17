import sqlite3
import sys

def remove_product_by_name(product_name):
          try:
                    # Connect to the database
                    conn = sqlite3.connect('static/example.db')
                    cursor = conn.cursor()

                    # Execute the delete statement
                    cursor.execute("DELETE FROM products WHERE name = ?", (product_name,))
                    conn.commit()

                    if cursor.rowcount == 0:
                              print(f"No product found with the name '{product_name}'.")
                    else:
                              print(f"Product '{product_name}' removed successfully.")

          except sqlite3.Error as e:
                    print(f"An error occurred: {e}")
          finally:
                    # Close the connection
                    if conn:
                              conn.close()


remove_product = input("Enter the name of the product you want to remove: ")
remove_product_by_name(remove_product)