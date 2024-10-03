import sqlite3

def add_product():
    name = input("Enter the product name: ")
    price = float(input("Enter the product price: "))
    image_path = input("Enter the product image path: ")

    Product = {
        "name": name,
        "price": price,
        "image_path": image_path
    }
    
    return Product

def add_in_database(Product):
    conn = sqlite3.connect('example.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            price REAL,
            image_path TEXT
        )
    ''')

    cursor.execute('''
        INSERT INTO products (name, price, image_path)
        VALUES (?, ?, ?)
    ''', (Product['name'], Product['price'], Product['image_path']))

    conn.commit()
    conn.close()

Product = add_product()
add_in_database(Product)
