import sqlite3

def create_orders_table():
    conn = sqlite3.connect('static/example.db')
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

def logicgate(customer_id, product_name):
    create_orders_table()
    customer_id = int(customer_id)
    conn = sqlite3.connect('static/example.db')
    cursor = conn.cursor()

    # Check if the order already exists
    cursor.execute('''
        SELECT quantity FROM orders WHERE customer_id = ? AND product_name = ?
    ''', (customer_id, product_name))
    result = cursor.fetchone()

    
    if result:
        # Update the quantity if the order exists
        new_quantity = result[0] + 1
        cursor.execute('''
            UPDATE orders SET quantity = ? WHERE customer_id = ? AND product_name = ?
        ''', (new_quantity, customer_id, product_name)) 
        print("Quantity updated successfully.")
    else:
        print("Order does not exist.")
        
        
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


def get_orders_by_customer(customer_id):
    create_orders_table()
    conn = sqlite3.connect('static/example.db')
    c = conn.cursor()
    c.execute("SELECT * FROM orders WHERE customer_id = ?", (customer_id,))
    orders = c.fetchall()
    conn.close()

    orders_list = []
    for order in orders:
        order_data = {
            'Order_ID': order[0],
            'customer_id': order[1],
            'product_name': order[2],
            'quantity': order[3],
            'price': order[4],
            'image_path': order[5]
        }
        orders_list.append(order_data)
    return orders_list



def extract_from_table(order_id):
    create_orders_table()
    conn = sqlite3.connect('static/example.db')
    cursor = conn.cursor()

    # Check if the order exists and get the current quantity
    cursor.execute('''
        SELECT quantity FROM orders WHERE id = ?
    ''', (order_id,))
    result = cursor.fetchone()

    if result:
        current_quantity = result[0]
        if current_quantity > 1:
            # Decrease the quantity by 1
            new_quantity = current_quantity - 1
            cursor.execute('''
                UPDATE orders SET quantity = ? WHERE id = ?
            ''', (new_quantity, order_id))
            print("Quantity decreased successfully.")
            return True
        else:
            # If the quantity is 1, delete the order
            cursor.execute('''
                DELETE FROM orders WHERE id = ?
            ''', (order_id,))
            print("Order deleted successfully.")
            return True
    else:
        print("Order not found.")
        return False




    conn.commit()
    conn.close()
