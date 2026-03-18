import { AiOutlineSend } from "react-icons/ai";
import { useState } from "react";

const QueryInput = ({ handleQuery, hasCharts }) => {
    const [query, setQuery] = useState("");
    const handleSubmit = () => {

        // Here you can add the logic to send the query to your backend or API
        handleQuery(query);
        setQuery(""); // Clear the input field after submission
    }
    return (
        <div className="container mt-5 d-flex justify-content-center">
           
            <div className="search-wrapper">

                <input
                    type="text"
                    className=" form-control search-input"
                    placeholder="Ask a question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button className="search-btn" onClick={handleSubmit}>
                    <AiOutlineSend />
                </button>

            </div>

        </div>
    );
};

export default QueryInput;