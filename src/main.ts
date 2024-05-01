import ollama, { Message } from 'ollama';

const targetModel = 'llama3:8b';
console.log(`Model: ${targetModel}`);

const { models } = await ollama.list();
if (!models.some((model) => model.name === targetModel)) {
  console.log(`Model not found. Pulling...`);
  const res = await ollama.pull({ model: targetModel });
  console.log(`Model pulled.`, res);
}

const textEncoder = new TextEncoder();

while (true) {
  const userPrompt = prompt('>');
  if (!userPrompt) {
    console.log('Bye!');
    break;
  }

  const message: Message = { role: 'user', content: userPrompt };
  const response = await ollama.chat({ model: targetModel, messages: [message], stream: true })
  for await (const part of response) {
    Deno.stdout.write(textEncoder.encode(part.message.content));
  }

  console.log();
}
