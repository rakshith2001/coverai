import {fileURLToPath} from "url";
import path from "path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
    modelPath: path.join(__dirname, "..", "..", "..", "models", "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf")
});

const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

export async function chatbot(message: string) {
    let ans = await session.prompt(message);
    return ans;
    

}
