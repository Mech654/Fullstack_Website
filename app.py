from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
from Orders import logicgate, get_orders_by_customer, create_orders_table
from Users import get_user_by_username, register_user, check_credentials, get_all_products

app = Flask(__name__)

# Allow CORS for specific origin
CORS(app, resources={r"/*": {"origins": "https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net"}})






def initialize_database():
    create_orders_table()

    


# region Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/buy')
def buy():
    return render_template('buy.html')  # Serve buy.html

@app.route('/chart')
def chart():
    return render_template('chart2.html')  # Serve chart.html

@app.route('/account')
def account():
    return render_template('account.html')  # Serve account.html

@app.route('/profile')
def profile():
    return render_template('profile2.html')

@app.route('/download')
def download():
    return render_template('download.html')  # Serve account.html


# Route to serve the .db file
@app.route('/download/x')
def y():
    try:
        return send_from_directory(directory='static', path='example.db', as_attachment=True, download_name='CustomDatabaseName.db')
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# endregion

#dessert



@app.route('/register', methods=['POST'])                                                     # Register route
def register():

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

    User_id = register_user(username, email, password)
    print(User_id)

    if User_id is not None:
        return jsonify({'result': 'Success', 'user_id': User_id})
    else:
        return jsonify({'result': 'Error', 'message': User_id}), 400
    





@app.route('/user/<username>', methods=['GET'])                                                 # Get user route
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




@app.route('/login', methods=['POST'])                                                            # Login route
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





@app.route('/get_dictionary', methods=['POST'])                                                   # Get dictionary route
def get_dictionary():
    bob = get_all_products()
    return jsonify(bob)
    



@app.route('/logicgate_route', methods=['POST'])                                              # New order route             
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
    

    

@app.route('/get_orders', methods=['POST'])                                                    # Get orders route
def get_orders():
    try:
        data = request.get_json()
        user = data.get('customer_id')
        if user is None:
            return jsonify({'result': 'Error', 'message': 'Invalid input'}), 400

        orders = get_orders_by_customer(user)
        return jsonify({'result': 'Success', 'orders': orders})
    except Exception as e:
        print(f"Error in /get_orders: {e}")
        return jsonify({'result': 'Error', 'message': str(e)}), 500






  
    

@app.route('/extract', methods=['GET'])
def extract():
    response_data = {
        "message": "Hello from the server!",
        "status": "success"
    }
    return jsonify(response_data)













if __name__ == "__main__":
    initialize_database()