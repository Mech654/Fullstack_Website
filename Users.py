import sqlite3




def initialize_database():
    conn = sqlite3.connect('static/example.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT, 
                  email TEXT UNIQUE, 
                  password TEXT)''')
    conn.commit()
    conn.close()


def get_user_by_username(username):
    conn = sqlite3.connect('static/example.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    return user

def register_user(username, email, password):
    initialize_database()  # Ensure the database is initialized
    try:
        conn = sqlite3.connect('static/example.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                  (username, email, password))
        conn.commit()
        user_id = c.lastrowid
    except sqlite3.IntegrityError as e:
        return str(e), None
    finally:
        conn.close()
    return user_id


def check_credentials(username, password):
    conn = sqlite3.connect('static/example.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = c.fetchone()
    conn.close()
    return user




def get_all_products():
    conn = sqlite3.connect('static/example.db')
    c = conn.cursor()

    # Only change: fetch products in random order
    c.execute("SELECT * FROM products ORDER BY RANDOM()")
    products = c.fetchall()

    conn.close()

    # Everything else remains the same
    products_list = []
    for product in products:
        product_data = {
            'Product_ID': product[0],
            'name': product[1],
            'price': product[2],
            'image_path': product[3]
        }
        products_list.append(product_data)
    return products_list

