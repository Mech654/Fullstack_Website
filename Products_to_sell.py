import sqlite3

def add_product():
    name = input("Enter the product name: ")
    price = float(input("Enter the product price: "))
    quantity = int(input("Enter the product quantity: "))
    description = input("Enter the product description: ")

    Product = {
        "name": name,
        "price": price,
        "quantity": quantity,
        "description": description
    }
    
    return Product

def add_in_database(Product):
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            price REAL,
            quantity INTEGER,
            description TEXT
        )
    ''')

    cursor.execute('''
        INSERT INTO products (name, price, quantity, description)
        VALUES (?, ?, ?, ?)
    ''', (Product['name'], Product['price'], Product['quantity'], Product['description']))

    conn.commit()
    conn.close()

Product = add_product()
add_in_database(Product)
