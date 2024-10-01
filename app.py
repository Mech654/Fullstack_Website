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

@app.route('/call-method', methods=['POST'])
def call_method():
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

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)



def check_credentials(username, password):
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = ?", (username,))
    row = c.fetchone()
    conn.close()
    if row and row[0] == password:
        return True
    return False

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print('Received data:', data)
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    if check_credentials(username, password):
        return jsonify({'result': 'Success'})
    else:
        return jsonify({'result': 'Error', 'message': 'Invalid credentials'}), 400