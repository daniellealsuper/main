/* styles.css */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.calculator {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;
}

h1 {
    margin-bottom: 20px;
    font-size: 24px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#result, #result-extenso {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
}

.updated {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
    padding: 10px;
    margin-top: 10px;
}
