import express from "express";
import cors from "cors";

import { dataset } from "./data.js";
import { generateQuery } from "./groq.js";
import { runQuery } from "./queryEngine.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {

const prompt = req.body.prompt;

try {

const llmResponse = await generateQuery(prompt);

console.log("LLM RAW RESPONSE:\n", llmResponse);

// remove markdown formatting
const cleaned = llmResponse
.replace(/```json/g, "")
.replace(/```/g, "")
.trim();

// extract JSON safely
const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
throw new Error("No JSON found in LLM response");
}

const parsed = JSON.parse(jsonMatch[0]);

let sql = parsed.sql;
let chart = parsed.chart;

// fix wrong table names
if (sql.toLowerCase().includes("from products")) {
sql = sql.replace(/from products/i, "FROM ?");
}

// fallback fix
if (!sql.includes("FROM ?")) {
sql = sql.replace(/FROM\s+\w+/i, "FROM ?");
}

/* -------- NORMALIZE FILTERS -------- */

sql = sql.replace(
/category\s*=\s*'([^']+)'/gi,
(_, val) => {
const cleaned = val
.toLowerCase()
.replace(" category", "")
.replace(" products", "")
.trim();

return `LOWER(category)='${cleaned}'`;
}
);

sql = sql.replace(
/region\s*=\s*'([^']+)'/gi,
(_, val) => {
const cleaned = val
.toLowerCase()
.replace(" region", "")
.trim();

return `LOWER(region)='${cleaned}'`;
}
);

sql = sql.replace(
/payment_method\s*=\s*'([^']+)'/gi,
(_, val) => {
const cleaned = val.toLowerCase().trim();
return `LOWER(payment_method)='${cleaned}'`;
}
);

console.log("FINAL SQL:", sql);

// run query
const result = runQuery(sql, dataset);

/* -------- NORMALIZE COLUMN NAMES -------- */

const normalized = result.map(row => {

const newRow = {};

for (const key in row) {

const lower = key.toLowerCase();

if (lower.includes("revenue"))
newRow["revenue"] = row[key];

else if (lower.includes("rating"))
newRow["rating"] = row[key];

else
newRow[key] = row[key];

}

return newRow;

});

/* -------- SINGLE METRIC DETECTION -------- */

if (normalized.length === 1) {

const keys = Object.keys(normalized[0]);

if (keys.length <= 2) {
chart = "metric";
}

}

res.send({
chart,
data: normalized
});

} catch (err) {

console.log("ERROR:", err);

res.send({
error: "Query failed"
});

}

});

app.listen(5000, () => {
console.log("Server running on port 5000");
});