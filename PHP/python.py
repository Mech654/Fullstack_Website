def your_python_function(param):
    return f"Received {param}"

if __name__ == "__main__":
    import sys
    param = sys.argv[1]
    result = your_python_function(param)
    print(result)




