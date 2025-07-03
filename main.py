from flask import Flask, request, jsonify
import time

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    delay = int(data.get("delay", 5))

    print(f"Iniciando espera de {delay} segundos...")
    time.sleep(delay)
    print("Tempo finalizado. Respondendo...")

    return jsonify({
        "status": "ok",
        "mensagem": f"Timer de {delay} segundos concluído."
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)