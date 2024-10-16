import sqlite3

def run_query(database, query):
    try:
    
        conn = sqlite3.connect(database)
        cursor = conn.cursor()
        
      
        cursor.execute(query)
        
      
        results = cursor.fetchall()
        
       
        column_names = [description[0] for description in cursor.description]
        
      
        print("\n" + " | ".join(column_names))
        print("-" * (len(column_names) * 12))
        
        
        for row in results:
            print(" | ".join(str(item) for item in row))
        
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        
        if conn:
            conn.close()

if __name__ == "__main__":
    database = "example.db"
    user_query = input("Enter your SQL query: ")
    run_query(database, user_query)
