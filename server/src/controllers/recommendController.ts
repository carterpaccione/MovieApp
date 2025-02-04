import { type Request, type Response } from "express";
import { ChatOpenAI } from "@langchain/openai";
import { MessageContent } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let model: ChatOpenAI;

if (apiKey) {
  model = new ChatOpenAI({
    temperature: 0.7,
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo-1106",
  });
} else {
  console.error("OpenAI API key not found");
}

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  recommendations: "An array of movie recommendations, each containing the title, year, and imdbID",
});

const formatInstructions = parser.getFormatInstructions();

const promptTemplate = new PromptTemplate({
  template: `You are an expert movie recommender. A user has a list of seen movies along with ratings.
    Based on the their ratings, recommend 3 movies you think they will likely enjoy not including anything from the user's seen list itself.
    
    The response should be a **raw JSON object** with the following fields: {format_instructions}.

    Do **not** include markdown code blocks.  
    Only return the JSON **itself** with no extra text.
    Here is the JSON Schema your output must adhere to: {{formatInstructions}}
    
    Here is the user's seen list:
    {movies}
    
    Provide recommendations only based on the seen list`,
  inputVariables: ["movies"],
  partialVariables: { format_instructions: formatInstructions },
});

const parseResponse = async (response: MessageContent) => {
  console.log("Response: ", response);
  const stringResponse = response.toString();
  const jsonMatch = stringResponse.match(/{.*}/s);
  if (jsonMatch) {
    const jsonString = jsonMatch[0];
    try {
      const parsedJson = JSON.parse(jsonString);
      console.log("Parsed JSON: ", parsedJson);
      return parsedJson;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.error("No JSON object found in the response");
  }
}

export const getRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { movies } = req.body;
  console.log("Received movies: ", movies);

  try {
    if (!movies || !Array.isArray(movies) || movies.length === 0) {
      res.status(400).json({ error: "No movies provided" });
      return;
    }
    console.log("Formatted Movies: ", movies);
    const formattedPrompt = await promptTemplate.format({ movies: movies });
    console.log("Formatted Prompt: ", formattedPrompt);

    if (!model) {
      res.status(500).json({ error: "Model not initialized" });
      return;
    }

    const rawResponse = await model.invoke(formattedPrompt);
    console.log("Raw Response: ", rawResponse);

    if (rawResponse.content) {
      console.log("Extrancted Content: ", rawResponse.content);
      console.log("Extrancted Content Type: ", typeof rawResponse.content);
      const parsedResponse = await parseResponse(rawResponse.content);
      res.json({
        seenMovies: movies,
        prompt: formattedPrompt,
        response: rawResponse,
        parsedResponse: parsedResponse,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    res.status(500).json({
      userInput: movies,
      prompt: null,
      response: "Internal Server Error",
    });
  }
};
