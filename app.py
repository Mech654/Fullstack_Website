from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
from Orders import logicgate
app = Flask(__name__)
CORS(app)

def initialize_database():
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT, 
                  email TEXT UNIQUE, 
                  password TEXT)''')
    conn.commit()
    conn.close()

def put_in_table(username, email, password):
    try:
        conn = sqlite3.connect('example.db')
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

def get_user_by_username(username):
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    return user

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/buy')
def buy():
    return render_template('buy.html')  # Serve buy.html

@app.route('/chart')
def chart():
    return render_template('chart.html')  # Serve chart.html

@app.route('/account')
def account():
    return render_template('account.html')  # Serve account.html


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print('Received data:', data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    User_id = put_in_table(username, email, password)
    print(User_id)

    if User_id is not None:
        return jsonify({'result': 'Success', 'user_id': User_id})
    else:
        return jsonify({'result': 'Error', 'message': User_id}), 400

@app.route('/user/<username>', methods=['GET'])
def get_user(username):
    user = get_user_by_username(username)
    if user:
        user_data = {
            'username': user[1],
            'email': user[2]
        }
        return jsonify({'result': 'Success', 'user': user_data})
    else:
        return jsonify({'result': 'Error', 'message': 'User not found'}), 404

def check_credentials(username, password):
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = c.fetchone()
    conn.close()
    return user


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print('Received data:', data)
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    user = check_credentials(username, password)
    
    if user:
        user_data = {
            'User_ID': user[0],
            'username': user[1],
            'email': user[2]
        }
        return jsonify({'result': 'Success', 'user': user_data})
    else:
        return jsonify({'result': 'Error', 'message': 'Invalid credentials'}), 401

@app.route('/get_dictionary', methods=['POST'])
def get_dictionary():
    bob = get_all_products()
    return jsonify(bob)
    
def get_all_products():
    conn = sqlite3.connect('example.db')
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

@app.route('/logicgate_route', methods=['POST'])
def logicgate_route():
    data = request.get_json()
    user = data.get('customer_id')
    product = data.get('product_name')

    if user is None or product is None:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    try:
        result = logicgate(user, product)
        return jsonify({'result': 'Success', 'output': result})
    except Exception as e:
        return jsonify({'result': 'Error', 'message': str(e)}), 400

@app.route('/get_orders', methods=['POST'])
def get_orders():
    data = request.get_json()
    user = data.get('customer_id')
    if user is None:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    orders = get_orders_by_customer(user)
    return jsonify({'result': 'Success', 'orders': orders})

def get_orders_by_customer(customer_id):
    conn = sqlite3.connect('example.db')
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

if __name__ == '__main__':
    initialize_database()
    # Remove app.run() for Azure deployment (handled by WSGI server like Gunicorn)
