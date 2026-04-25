import pandas as pd
import re

# Add this at TOP of file - outside all functions
# This tells pandas the correct order of months
MONTH_ORDER = {
    'january': 1, 'february': 2, 'march': 3,
    'april': 4, 'may': 5, 'june': 6,
    'july': 7, 'august': 8, 'september': 9,
    'october': 10, 'november': 11, 'december': 12
}

def get_columns(file_path):
    df = pd.read_csv(file_path)
    return list(df.columns)


def run_query(sql, file_path):
    try:
        df = pd.read_csv(file_path)
        sql_lower = sql.lower().strip()

        col_map = {col.lower(): col for col in df.columns}

        def real_col(name):
            return col_map.get(name.lower(), name)

        # NEW HELPER - checks if a column contains month names
        def is_month_column(col_name):
            sample = df[col_name].dropna().head(5).str.lower().tolist()
            return any(val in MONTH_ORDER for val in sample)

        # Pattern 1 - WHERE IN filter
        where_in_match = re.search(
            r"where\s+(\w+)\s+in\s+\(([^)]+)\)",
            sql_lower
        )

        group_match = re.search(r"group by (\w+)", sql_lower)
        sum_match = re.search(r"sum\((\w+)\)", sql_lower)
        avg_match = re.search(r"avg\((\w+)\)", sql_lower)
        count_match = re.search(r"count\(\*\)", sql_lower)
        limit_match = re.search(r"limit\s+(\d+)", sql_lower)
        order_match = re.search(r"order by .+ (desc|asc)", sql_lower)

        # Apply WHERE IN filter first
        if where_in_match:
            filter_col = real_col(where_in_match.group(1))
            raw_values = where_in_match.group(2)
            values = [
                v.strip().strip("'").strip('"')
                for v in raw_values.split(",")
            ]
            df = df[df[filter_col].str.lower().isin(
                [v.lower() for v in values]
            )]

        # Pattern 2 - GROUP BY + SUM
        if group_match and sum_match:
            group_col = real_col(group_match.group(1))
            value_col = real_col(sum_match.group(1))

            result = df.groupby(group_col)[value_col].sum().reset_index()

            # Check if grouping by month column
            # WHY: Sort by month order not alphabetically
            if is_month_column(group_col):
                result["_sort"] = result[group_col].str.lower().map(MONTH_ORDER)
                result = result.sort_values("_sort").drop(columns=["_sort"])

            elif order_match:
                ascending = order_match.group(1) == "asc"
                result = result.sort_values(value_col, ascending=ascending)

            if limit_match:
                n = int(limit_match.group(1))
                result = result.head(n)

            return result.to_dict(orient="records")

        # Pattern 3 - GROUP BY + AVG
        if group_match and avg_match:
            group_col = real_col(group_match.group(1))
            value_col = real_col(avg_match.group(1))

            result = df.groupby(group_col)[value_col].mean().reset_index()
            result[value_col] = result[value_col].round(2)

            # Sort by month if needed
            if is_month_column(group_col):
                result["_sort"] = result[group_col].str.lower().map(MONTH_ORDER)
                result = result.sort_values("_sort").drop(columns=["_sort"])

            if limit_match:
                result = result.head(int(limit_match.group(1)))

            return result.to_dict(orient="records")

        # Pattern 4 - GROUP BY + COUNT
        if group_match and count_match:
            group_col = real_col(group_match.group(1))

            result = df.groupby(group_col).size().reset_index(name="count")

            if is_month_column(group_col):
                result["_sort"] = result[group_col].str.lower().map(MONTH_ORDER)
                result = result.sort_values("_sort").drop(columns=["_sort"])

            elif order_match:
                ascending = order_match.group(1) == "asc"
                result = result.sort_values("count", ascending=ascending)

            if limit_match:
                result = result.head(int(limit_match.group(1)))

            return result.to_dict(orient="records")

        # Pattern 5 - Single metric no GROUP BY
        if sum_match and not group_match:
            value_col = real_col(sum_match.group(1))
            total = df[value_col].sum()
            return [{"metric": "Total", "value": total}]

        return {"error": "Query pattern not recognized"}

    except Exception as e:
        return {"error": str(e)}