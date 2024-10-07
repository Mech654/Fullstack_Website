import sqlite3

def create_orders_table():
    conn = sqlite3.connect('example.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            image_path TEXT,
            FOREIGN KEY (customer_id) REFERENCES users(User_ID)
        )
    ''')
    conn.commit()
    conn.close()
    print("Table 'orders' created successfully.")

# Uncomment the following line to create the table once
create_orders_table()

def logicgate(customer_id, product_name):
    customer_id = int(customer_id)
    conn = sqlite3.connect('example.db')
    cursor = conn.cursor()

    # Check if the order already exists
    cursor.execute('''
        SELECT quantity FROM orders WHERE customer_id = ? AND product_name = ?
    ''', (customer_id, product_name))
    result = cursor.fetchone()

    print(result)
    if result:
        # Update the quantity if the order exists
        new_quantity = result[0] + 1
        cursor.execute('''
            UPDATE orders SET quantity = ? WHERE customer_id = ? AND product_name = ?
        ''', (new_quantity, customer_id, product_name)) 
        print("Quantity updated successfully.")
    else:
        print("Order does not exist.")
        print(product_name)
        
        cursor.execute('''
            SELECT price, image_path FROM products WHERE name = ?
        ''', (product_name,))

        price_result = cursor.fetchone()

        if price_result:
            price = price_result[0]
            image_path = price_result[1]
        else:
            raise ValueError("Product not found in the products table.")
        
        # Insert a new order if it doesn't exist
        cursor.execute('''
            INSERT INTO orders (customer_id, product_name, quantity, price, image_path)
            VALUES (?, ?, ?, ?, ?)
        ''', (customer_id, product_name, 1, price, image_path))  # Ensure 'price' and 'image_src' are the variables that hold the product price and image source

        print("Order inserted successfully.")

    conn.commit()
    conn.close()
