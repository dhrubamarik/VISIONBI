import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
apiKey: process.env.GROQ_API_KEY
});

export const generateQuery = async(prompt)=>{

const completion = await groq.chat.completions.create({

model:"llama-3.3-70b-versatile",

messages:[

{
role:"system",
content: `You are a Business Intelligence assistant.

Dataset is a JSON array.

Columns:

date
product
category
region
price
discount
quantity
payment_method
rating
total_revenue

IMPORTANT RULES:

1. Always use FROM ? when querying.
2. Use ONLY the column names listed above.
3. total_revenue is the revenue column.
4. Return ONLY JSON.

Example:

User: revenue by category

{
"sql":"SELECT category, SUM(total_revenue) as revenue FROM ? GROUP BY category",
"chart":"bar"
}

User: revenue by region

{
"sql":"SELECT region, SUM(total_revenue) as revenue FROM ? GROUP BY region",
"chart":"bar"
}
`
},

{
role:"user",
content:prompt
}

]

});

return completion.choices[0].message.content;

}