import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

const accountId = 7;
const token = 'eyJhY2Nlc3MtdG9rZW4iOiJLc2JJeFc3azROdGk4Snk4bUZFblFRIiwidG9rZW4tdHlwZSI6IkJlYXJlciIsImNsaWVudCI6IjNzMUNyNk9KTEQ1T0QzYmJ2QmNRUWciLCJleHBpcnkiOiIxNzU2ODM1NzYzIiwidWlkIjoiZ3J1cG9kaWdpdGFsc2ZAZ21haWwuY29tIn0=';

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
};

app.post('/webhook-saldo', async (req, res) => {
  console.log('Webhook acionado', req.body.id);

  let conversationId = req.body.conversation_id || req.body.id || (req.body.messages && req.body.messages[0]?.conversation_id);

  if (!conversationId && req.body.url) {
    const match = req.body.url.match(/conversations\/(\d+)/);
    if (match) conversationId = match[1];
  }

  if (!conversationId) {
    return res.status(400).json({ erro: 'conversation_id não fornecido ou detectado.' });
  }

  const mensagem1 = 'Olá, o seu saldo já está APROVADO e o valor é creditado em até 15 minutos na sua conta. \n\nPodemos seguir com a liberação? ';
  const mensagem2 = 'Oi Juliana, te mandei algumas informações sobre seu FGTS.\nVi que não tive retorno referente a sua proposta.\n\nGostaria de saber se ficou com alguma dúvida quanto ao valor disponível?';
  try {
    await sleep(15)
    const response = await axios.post(
      `https://aesirchat.com/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
      { content: mensagem1, private: false },
      { headers }
    );
    await sleep(0.3)
    const response2 = await axios.post(
      `https://aesirchat.com/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
      { content: mensagem2, private: false },
      { headers }
    );
    console.log(`Mensagem enviada na conversa ${conversationId}`);
    res.status(200).json({ status: 'sucesso', conversa: conversationId, resposta: response.data });
  } catch (error) {
    console.error('Erro ao enviar:', error.response?.data || error.message);
    res.status(500).json({ erro: 'Falha ao enviar mensagem', detalhe: error.response?.data || error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Webhook rodando em http://localhost:${PORT}/webhook`);
});


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms*60000));
}