
const express = require('express')

const { DiscussServiceClient,TextServiceClient  } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const { GOOGLE_GEN_AI_API_KEY } = process.env;

const router = express.Router();

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(GOOGLE_GEN_AI_API_KEY),
});

const clientTextService = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(GOOGLE_GEN_AI_API_KEY),
  });

const context = "You are a creative content writer helping restaurants to write description of the their food or beverage menu card. you need to write description of the food or beverage based on the name and keywords provided. You can be expressive. \n\nYou will receive input from user in the format:\n{\n        \"name\": \"NAME OF THE FOOD OR BEVERAGE\",\n        \"ingredients_keywords\": \"COMMA SEPERATED VALUES\",\n        \"maximum_words\":10\n}\n\n\nYour response should strictly always be in the format:\n {\"description\":\"YOUR_DESCRIPTION\"}\n\nYou should also check the maximum_words value from the input and if present your total number of words in description should near to maxium words count";
const examples = [
    {
        "input": {
            "content": "{\n        \"name\": \"Pan Seared T-Bone Steak\",\n        \"ingredients_keywords\": \"T-Bone steak, salt, black pepper, olive oil, garlic, rosemary (optional), butter (optional)\",\"maximum_words\":10\n     }"
        },
        "output": {
            "content": "{ \"description\": \"A juicy T-Bone steak seasoned with salt and pepper, seared to perfection\"}"
        }
    },
    {
        "input": {
            "content": "{\"name\": \"Filipino Beef Steak\",\n        \"ingredients_keywords\": \"Beef sirloin, soy sauce, calamansi juice (or lemon juice), garlic, onion, black pepper, cooking oil\"\n      }"
        },
        "output": {
            "content": "{\"description\": \"Also known as 'Bistek Tagalog,' this Filipino dish features thinly sliced beef marinated in a mixture of soy sauce and calamansi juice, then pan-fried with garlic and onions.\"}"
        }
    },
    {
        "input": {
            "content": "{ \"name\": \"Pina Colada\",\n        \"ingredients_keywords\": \"Pineapple juice, coconut cream, white rum, crushed ice\"}"
        },
        "output": {
            "content": "{ \"description\": \"A tropical cocktail made with a blend of refreshing pineapple juice, creamy coconut cream, and a splash of white rum. Served over crushed ice for a cool and delicious drink.\"}"
        }
    },
    {
        "input": {
            "content": "{ \"name\": \"Sizzling Garlic Shrimp\",\n        \"ingredients_keywords\": \"Large shrimp, butter, garlic, lemon juice, parsley, red pepper flakes, salt, black pepper\"}"
        },
        "output": {
            "content": "{ \"description\": \"Plump shrimp are sautéed in butter, garlic, and a touch of red pepper flakes, then finished with a squeeze of fresh lemon juice and a sprinkle of parsley. Served sizzling hot for a burst of flavor.\"}"
        }
    },
    {
        "input": {
            "content": "{\"name\": \"Mediterranean Quinoa Salad\",\n        \"ingredients_keywords\": \"Quinoa, cucumbers, cherry tomatoes, red onion, Kalamata olives, feta cheese, fresh parsley, lemon juice, olive oil, salt, black pepper\"\n       }"
        },
        "output": {
            "content": "{ \"description\": \"A comforting dish with rice noodles bathed in a fragrant green curry sauce made from coconut milk and green curry paste. Loaded with your choice of chicken or tofu, along with colorful vegetables and garnished with Thai basil leaves and lime wedges.\"}"
        }
    },
    {
        "input": {
            "content": "{ \"name\": \"Golden Turmeric Latte\",\n        \"ingredients_keywords\": \"Milk (or non-dairy milk), ground turmeric, ground cinnamon, ginger, honey (or maple syrup for vegan option), black pepper (optional)\"}"
        },
        "output": {
            "content": "{\"description\": \"A warming beverage made by combining milk with the vibrant spices of turmeric, ginger, and cinnamon. Sweetened with honey (or maple syrup for a vegan option) and optionally enhanced with a pinch of black pepper for added depth of flavor.\"}"
        }
    },
    {
        "input": {
            "content": "{ \"name\": \"Crispy Honey Sriracha Wings\",\n        \"ingredients_keywords\": \"Chicken wings, honey, sriracha sauce, soy sauce, garlic, ginger, green onions, sesame seeds (optional)\"}"
        },
        "output": {
            "content": "{\"description\": \"Irresistibly crispy chicken wings are coated in a sticky glaze made from a blend of honey, sriracha sauce, soy sauce, garlic, and ginger. Garnished with chopped green onions and optional sesame seeds for extra crunch and flavor.\"}"
        }
    },
    {
        "input": {
            "content": "{ \"name\": \"Raspberry White Chocolate Cheesecake\",\n        \"ingredients_keywords\": \"Graham cracker crumbs, butter, cream cheese, sugar, eggs, vanilla extract, white chocolate chips, raspberries, heavy cream\"}"
        },
        "output": {
            "content": "{\"description\": \"A decadent dessert featuring a buttery graham cracker crust, a rich and creamy cheesecake filling studded with white chocolate chips, and a swirl of vibrant raspberry sauce. Garnished with fresh raspberries and a dollop of whipped cream.\"}"
        }
    },
    {
        "input": {
            "content": "{\"name\": \"Classic Margherita Pizza\",\n        \"ingredients_keywords\": \"Pizza dough, tomato sauce, fresh mozzarella cheese, fresh basil leaves, olive oil, salt\"}"
        },
        "output": {
            "content": "{ \"description\": \"A timeless pizza topped with a simple combination of tomato sauce, fresh mozzarella cheese, and aromatic basil leaves. Baked to perfection, then drizzled with olive oil and a sprinkle of salt for a burst of classic Italian flavors.\"}"
        }
    }
];
// const messages = [
//     {
//         "content": "{\"name\": \"Crispy Tofu with Peanut Sauce\",\n        \"ingredients_keywords\": \"Firm tofu, cornstarch, soy sauce, sesame oil, peanut butter, lime juice, honey, garlic, ginger, green onions, crushed peanuts (optional)\", \"maximum_words\":10}"
//     },
//     {
//         "content": "{\n    \"description\": \"Crispy tofu tossed in a savory peanut sauce. Served with green onions and crushed peanuts for extra crunch and flavor.\"\n}"
//     },
//     {
//         "content": "{\"name\": \"Crispy Tofu with Peanut Sauce\",\n        \"ingredients_keywords\": \"Firm tofu, cornstarch, soy sauce, sesame oil, peanut butter, lime juice, honey, garlic, ginger, green onions, crushed peanuts (optional)\", \"maximum_words\":50}"
//     },
//     {
//         "content": "{\n    \"description\": \"Crispy tofu tossed in a savory peanut sauce. Served with green onions and crushed peanuts for extra crunch and flavor.\\n\\nTo make the tofu, press it between paper towels to remove excess moisture. Cut it into cubes and coat it in cornstarch. Heat oil in a large skillet over medium heat and cook the tofu until golden brown and crispy.\\n\\nTo make the peanut sauce, whisk together soy sauce, sesame oil, peanut butter, lime juice, honey, garlic, and ginger.\\n\\nTo serve, toss the tofu in the peanut sauce and top with green onions and crushed peanuts. Enjoy!\"\n}"
//     }
// ];


router.post('/generate-description', async (req, res) => {

    const { name, keywords, maximum_words } = req.body;
    const response = {}
    if (!name || !keywords || !maximum_words) {
        response.status = "error"
        response.error = "Fields cannot be blank"
        res.json({ response });
        return
    }

    const messages = []
    const MODEL_NAME = "models/chat-bison-001";


    messages.push( {
        "content": "{\"name\": \"" + name + "\",\n        \"ingredients_keywords\": \"" + keywords + "\", \"maximum_words\":" + maximum_words + "}"
    });

    try {

        const aiResponse = await client.generateMessage({
            // required, which model to use to generate the result
            model: MODEL_NAME,
            // optional, 0.0 always uses the highest-probability result
            temperature: 0.25,
            // optional, how many candidate results to generate
            candidateCount: 1,
            // optional, number of most probable tokens to consider for generation
            top_k: 40,
            // optional, for nucleus sampling decoding strategy
            top_p: 0.95,
            prompt: {
                // optional, sent on every request and prioritized over history
                context: context,
                // optional, examples to further finetune responses
                examples: examples,
                // required, alternating prompt/response messages
                messages: messages,
            },
        })
        // .then(result => {
        //     console.log(JSON.stringify(result, null, 2));
        // });

        console.log("aiResponse", JSON.stringify(aiResponse))

        response.status = "ok"
        
        response.description = aiResponse[0].candidates

    } catch (e) {
        response.status = "error"
        response.error = e.message
    }

    res.json({ response });
});




router.post('/generate-name', async (req, res) => {

    const { name } = req.body;
    const response = {}
    if (!name) {
        response.status = "error"
        response.error = "Dish name cannot be blank"
        res.json({ response });
        return
    }

   

    const MODEL_NAME = "models/text-bison-001";

    const input = name;
    const promptString = `You are a content writer for world wide restaurants. You are required to respond with only 10 alternative names of the dish given to you. 
    Your response format should strictly be ["ANSWER_1","ANSWER_2","ANSWER_3","ANSWER_4","ANSWER_5","ANSWER_6","ANSWER_7","ANSWER_8","ANSWER_9","ANSWER_10"] dont add any other content in your response
    input:  beef steak
    output: [
      "Sirloin Steak",
      "Ribeye Steak",
      "T-bone Steak",
      "Porterhouse Steak",
      "Filet Mignon",
      "New York Strip Steak",
      "Flat Iron Steak",
      "Skirt Steak",
      "Flank Steak"
    ]
    input:  pork chops
    output: ["Pork cutlet ",
    "Pork loin chop", 
    "Pork rib chop ",
    "Pork shoulder chop", 
    "Pork blade chop ",
    "Pork sirloin chop ",
    "Pork loin roast ",
    "Pork rib roast ",
    "Pork shoulder roast", 
    "Pork blade roast"
    ]
    input:  french fries
    output: ["French-fried potatoes ",  
    "French fries ",  
    "Chips ",  
    "Fries ",  
    "Shoestring potatoes ",  
    "Crisscross potatoes ",  
    "Batons de pommes frites ",  
    "Pommes frites ",  
    "Pommes allumettes ",  
    "Pommes pailles "
    ]
    input:  pork ribs
    output: ["Pork rib ",
    "Pork ribs ",
    "Back ribs ",
    "Ribs ",
    "Baby back ribs ",
    "Country-style ribs ",
    "Rib tips ",
    "St. Louis ribs ",
    "Ribs with sauce ",
    "Ribs with dry rub "
    ]
    input:  English breakfast
    output:  [ "Full English breakfast",  "Full Irish breakfast ",  "Scottish breakfast ",  "Welsh breakfast ",  "Ulster fry ",  "Fry-up ",  "Full Monty",   "Big breakfast",   "Hearty breakfast",   "Breakfast of champions" ]
    input:  chocolate cake
    output: ["Chocolate cake ",
    "Brownie cake ",
    "Layer cake ",
    "Rich chocolate cake ",
    "Cake with chocolate frosting ",
    "Chocolate chip cake ",
    "Devil's food cake ",
    "Chocolate gateau ",
    "Chocolate torte ",
    "Chocolate mousse cake"
    ]
    input:  chicken wings
    output: ["Chicken wing ",
    "Chicken drumette ",
    "Chicken drumstick ",
    "Chicken finger ",
    "Chicken tenders ",
    "Boneless chicken wing ",
    "Drumettes and wings ",
    "Chicken fingers and wings ",
    "Chicken strips and wings ",
    "Chicken nuggest and wings"
    ]
    input:  ${input}
    output:`;
    const stopSequences = [];
    try {

        const aiResponse = await clientTextService.generateText({
            // required, which model to use to generate the result
            model: MODEL_NAME,
            // optional, 0.0 always uses the highest-probability result
            temperature: 0.7,
            // optional, how many candidate results to generate
            candidateCount: 1,
            // optional, number of most probable tokens to consider for generation
            top_k: 40,
            // optional, for nucleus sampling decoding strategy
            top_p: 0.95,
            // optional, maximum number of output tokens to generate
            max_output_tokens: 1024,
            // optional, sequences at which to stop model generation
            stop_sequences: stopSequences,
            // optional, safety settings
            safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
            prompt: {
              text: promptString,
            },
          })
        // .then(result => {
        //     console.log(JSON.stringify(result, null, 2));
        // });

        console.log("aiResponse", JSON.stringify(aiResponse))

        response.status = "ok"
        
        response.names = aiResponse[0].candidates[0].output

    } catch (e) {
        response.status = "error"
        response.error = e.message
    }

    res.json({ response });
});

module.exports = router;