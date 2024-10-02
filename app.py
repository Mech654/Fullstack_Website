from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

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
    except sqlite3.IntegrityError as e:
        return str(e)
    finally:
        conn.close()
    return None

def get_user_by_username(username):
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    return user

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print('Received data:', data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    error = put_in_table(username, email, password)
    if error:
        return jsonify({'result': 'Error', 'message': error}), 400

    return jsonify({'result': 'Success'})

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
            'username': user[1],
            'email': user[2]
        }
        return jsonify({'result': 'Success', 'user': user_data})
    else:
        return jsonify({'result': 'Error', 'message': 'Invalid credentials'}), 400

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)