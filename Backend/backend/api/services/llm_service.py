import json
import re
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_query(prompt, columns):
    
    # Safety check - if no columns found
    if not columns:
        return {"error": "No columns found in file"}

    system_prompt = f"""
You are a business data analyst AI assistant.

The data is a CSV file loaded as pandas DataFrame called 'df'.
Available columns: {columns}

IMPORTANT RULES:
1. Always use 'df' as table name
2. Use ONLY the column names listed above
3. Return ONLY valid JSON - no explanation, no markdown
4. CRITICAL: If user asks for "trend" but NO date/month/time 
   column exists in available columns, 
   treat it as a regular GROUP BY query instead
   and use bar chart not line chart

For these query types use these SQL patterns:

GROUP BY queries:
SELECT col1, SUM(col2) FROM df GROUP BY col1

TOP N queries:
SELECT col1, SUM(col2) FROM df GROUP BY col1 ORDER BY SUM(col2) DESC LIMIT N

FILTER + GROUP queries (compare specific values):
SELECT col1, SUM(col2) FROM df WHERE col1 IN ('val1','val2') GROUP BY col1

AVERAGE queries:
SELECT col1, AVG(col2) FROM df GROUP BY col1

COUNT queries:
SELECT col1, COUNT(*) FROM df GROUP BY col1

SINGLE VALUE queries (highest, total, max):
SELECT col1, SUM(col2) FROM df GROUP BY col1 ORDER BY SUM(col2) DESC LIMIT 1

Chart type rules:
- bar: comparisons between categories
- line: trends over time ONLY when month/date/year column exists
- pie: percentage or share of total
- metric: single number answer (highest, total, max, min)

TREND RULE:
- Only use line chart if columns contain: month, date, year, week, day, time, period
- Available columns are: {columns}
- If none of these time columns exist → use bar chart instead

Return ONLY this JSON format:
{{
    "sql": "your sql here",
    "chart": "bar | line | pie | metric",
    "intent": "group | top | filter | average | count | metric"
}}
"""
    try:
        print(f"Calling Groq with prompt: {prompt}")
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        )

        raw_output = response.choices[0].message.content
        print(f"Groq raw output: {raw_output}")

        # Remove markdown code blocks if Groq adds them
        cleaned = raw_output.replace("```json", "").replace("```", "").strip()

        # Extract JSON object
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)

        if not match:
            print("No JSON found in Groq response")
            return {"error": "Groq did not return valid JSON"}

        parsed = json.loads(match.group())
        print(f"Parsed output: {parsed}")
        
        # Validate required fields exist
        if "sql" not in parsed:
            return {"error": "Groq response missing sql field"}
            
        if "chart" not in parsed:
            parsed["chart"] = "bar"  # default to bar chart
            
        return parsed

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {str(e)}")
        return {"error": f"Could not parse Groq response: {str(e)}"}
        
    except Exception as e:
        print(f"Groq API error: {str(e)}")
        return {"error": f"Groq API failed: {str(e)}"}