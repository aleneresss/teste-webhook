from flask import Flask, request, jsonify, render_template
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/webhook', methods=['POST'])
def webhook():
    delay = 5  # segundos
    time.sleep(delay)
    return jsonify({"status": "ok", "mensagem": f"Aguardou {delay} segundos"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
